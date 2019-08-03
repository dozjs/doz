const {TAG, CMP_INSTANCE, INSTANCE, REGEX} = require('../constants');
const observer = require('./observer');
const hooks = require('./hooks');
const update = require('../vdom').updateElement;
const store = require('./store');
const ids = require('./ids');
const proxy = require('../proxy');
const toInlineStyle = require('../utils/to-inline-style');
const queueReady = require('./queue-ready');
const queueDraw = require('./queue-draw');
const extendInstance = require('./extend-instance');
const cloneObject = require('../utils/clone-object');
const toLiteralString = require('../utils/to-literal-string');
const removeAllAttributes = require('../utils/remove-all-attributes');
const h = require('../vdom/h');
const loadLocal = require('./load-local');
const localMixin = require('./local-mixin');
const {compile} = require('../vdom/parser');
//const delay = require('../utils/delay');
const propsInit = require('./props-init');
const {updateBoundElementsByPropsIteration} = require('./update-bound-element');
const DOMManipulation = require('./DOMManipulation');

class Component extends DOMManipulation {

    constructor(opt) {

        super();

        Object.defineProperties(this, {
            _isSubclass: {
                value: this.__proto__.constructor !== Component
            },
            _rawProps: {
                value: {},
                writable: true
            }
        });

        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };

        this._initRawProps(opt);

        defineProperties(this, opt);

        // Assign cfg to instance
        extendInstance(this, opt.cmp.cfg, opt.dProps);

        // Create mixin
        localMixin(this);

        // Load local components
        loadLocal(this);

        const beforeCreate = hooks.callBeforeCreate(this);
        if (beforeCreate === false)
            return;

        // Create observer to props
        observer.create(this, true);
        // Create shared store
        store.create(this);
        // Create ID
        ids.create(this);
        // Add callback to ready queue
        queueReady.add(this);
        // Add callback app draw
        queueDraw.add(this);
        // Call create
        hooks.callCreate(this);
    }

    set props(props) {
        if (typeof props === 'function')
            props = props();

        this._rawProps = Object.assign({}, props, this._opt ? this._opt.props : {});
        observer.create(this);
        store.sync(this);
    }

    get props() {
        return this._props;
    }

    loadProps(props) {
        if (typeof props !== 'object')
            throw new TypeError('Props must be an object');

        this._rawProps = Object.assign({}, props);
        propsInit(this);
        updateBoundElementsByPropsIteration(this);
        observer.create(this);
        store.sync(this);
        hooks.callLoadProps(this);
    }

    set config(obj) {
        if (!this._isSubclass)
            throw new Error('Config is allowed only for classes');

        if (this._configured)
            throw new Error('Already configured');

        if (typeof obj !== 'object')
            throw new TypeError('Config must be an object');

        if (typeof obj.mixin === 'object') {
            this.mixin = obj.mixin;
            localMixin(this);
        }

        if (typeof obj.components === 'object') {
            this.components = obj.components;
            loadLocal(this);
        }

        if (typeof obj.store === 'string') {
            this.store = obj.store;
            store.create(this);
        }

        if (typeof obj.id === 'string') {
            this.id = obj.id;
            ids.create(this);
        }

        if (typeof obj.autoCreateChildren === 'boolean') {
            this.autoCreateChildren = obj.autoCreateChildren;
        }

        if (typeof obj.updateChildrenProps === 'boolean') {
            this.updateChildrenProps = obj.updateChildrenProps;
        }

        this._configured = true;

        hooks.callConfigCreate(this);
    }

    getHTMLElement() {
        return this._parentElement;
    }

    beginSafeRender() {
        proxy.beginRender(this.props)
    }

    endSafeRender() {
        proxy.endRender(this.props)
    }

    emit(name, ...args) {
        if (this._callback && this._callback[name] !== undefined
            && this.parent[this._callback[name]] !== undefined
            && typeof this.parent[this._callback[name]] === 'function') {
            this.parent[this._callback[name]].apply(this.parent, args);
        }
    }

    each(obj, func, safe = false) {
        let res;
        if (Array.isArray(obj)) {
            if (safe) this.beginSafeRender();
            res = obj.map(func).map((stringEl, i) => {
                if (typeof stringEl === 'string') {
                    return stringEl.trim()
                }
            }).join('');
            if (safe) this.endSafeRender();
        }
        return res;
    }

    // noinspection JSMethodCanBeStatic
    toStyle(obj) {
        return toInlineStyle(obj)
    }

    getStore(storeName) {
        return this.app.getStore(storeName);
    }

    getComponentById(id) {
        return this.app.getComponentById(id);
    }

    getCmp(id) {
        return this.app.getComponentById(id);
    }

    // noinspection JSMethodCanBeStatic
    template() {
        return '';
    }

    render(initial, changes = []) {
        if (this._renderPause) return;
        this.beginSafeRender();
        const template = this.template(h);
        this.endSafeRender();
        let next = compile(template, this);
        this.app.emit('draw', next, this._prev, this);
        queueDraw.emit(this, next, this._prev);

        let candidateKeyToRemove;
        let thereIsDelete = false;
        changes.forEach((change) => {
            // Trova la presunta chiave da eliminare
            if (Array.isArray(change.target)) {
                if ((change.type === 'update' || change.type === 'delete') && candidateKeyToRemove === undefined) {
                    if (change.previousValue && typeof change.previousValue === 'object' && change.previousValue.key !== undefined) {
                        candidateKeyToRemove = change.previousValue.key;
                    }
                }
                if (change.type === 'delete')
                    thereIsDelete = true;
            }

            // Se l'array viene svuotato allora dovrò cercare tutte le eventuali chiavi che fanno riferimento ai nodi
            if (candidateKeyToRemove === undefined && (Array.isArray(change.previousValue) && !Array.isArray(change.newValue))
                || (Array.isArray(change.previousValue) && change.previousValue.length > change.newValue.length)
            ) {
                change.previousValue.forEach(item => {
                    if (item && typeof item === 'object' && item.key !== undefined && this._dynamicNodes[item.key] !== undefined) {
                        if(this._dynamicNodes[item.key][INSTANCE]) {
                            this._dynamicNodes[item.key][INSTANCE].destroy();
                        } else {
                            this._dynamicNodes[item.key].parentNode.removeChild(this._dynamicNodes[item.key]);
                        }
                    }
                });
            }
        });

        if (!thereIsDelete)
            candidateKeyToRemove = undefined;

        if (candidateKeyToRemove !== undefined && this._dynamicNodes[candidateKeyToRemove] !== undefined) {
            if(this._dynamicNodes[candidateKeyToRemove][INSTANCE]) {
                this._dynamicNodes[candidateKeyToRemove][INSTANCE].destroy();
            } else {
                this._dynamicNodes[candidateKeyToRemove].parentNode.removeChild(this._dynamicNodes[candidateKeyToRemove]);
            }
        } else {
            const rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial);

            //Remove attributes from component tag
            removeAllAttributes(this._cfgRoot, ['data-is', 'data-uid', 'data-key']);

            if (!this._rootElement && rootElement) {
                this._rootElement = rootElement;
                this._parentElement = rootElement.parentNode;
            }
            this._prev = next;
        }

        hooks.callAfterRender(this);
        drawDynamic(this);
        /*if (initial) {
            drawDynamic(this);
        } else {
            delay(() => drawDynamic(this));
        }*/
    }

    renderPause() {
        this._renderPause = true;
    }

    renderResume(callRender = true) {
        this._renderPause = false;
        if (callRender)
            this.render();
    }

    get isRenderPause() {
        return this._renderPause;
    }

    mount(template, cfg = {}) {

        if (this._unmounted) {
            if (hooks.callBeforeMount(this) === false)
                return this;

            this._unmountedPlaceholder.parentNode.replaceChild(this._unmountedParentNode, this._unmountedPlaceholder);

            this._unmounted = false;
            this._unmountedParentNode = null;
            this._unmountedPlaceholder = null;

            hooks.callMount(this);

            Object.keys(this.children).forEach(child => {
                this.children[child].mount();
            });

            return this;
        } else if (template) {
            if (this._rootElement.nodeType !== 1) {
                const newElement = document.createElement(this.tag + TAG.SUFFIX_ROOT);
                this._rootElement.parentNode.replaceChild(newElement, this._rootElement);
                this._rootElement = newElement;
                this._rootElement[CMP_INSTANCE] = this;
            }

            let root = this._rootElement;

            if (typeof cfg.selector === 'string')
                root = root.querySelector(cfg.selector);
            else if (cfg.selector instanceof HTMLElement)
                root = cfg.selector;

            this._unmounted = false;
            this._unmountedParentNode = null;
            this._unmountedPlaceholder = null;

            return this.app.mount(template, root, this);
        }
    }

    unmount(onlyInstance = false, byDestroy, silently) {
        if (!onlyInstance && (Boolean(this._unmountedParentNode)
            || !this._rootElement || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode)) {
            return;
        }

        if (hooks.callBeforeUnmount(this) === false)
            return false;

        this._unmountedParentNode = this._rootElement.parentNode;
        this._unmountedPlaceholder = document.createComment(Date.now().toString());

        if (!onlyInstance) {
            this._rootElement.parentNode.parentNode.replaceChild(this._unmountedPlaceholder, this._unmountedParentNode);
        } else if (this._rootElement.parentNode) {
            //this._rootElement.parentNode.innerHTML = '';
            this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
        }

        this._unmounted = !byDestroy;

        if (!silently)
            hooks.callUnmount(this);

        Object.keys(this.children).forEach(child => {
            this.children[child].unmount(onlyInstance, byDestroy, silently);
        });

        return this;
    }

    destroy(onlyInstance) {

        if (this.unmount(onlyInstance, true) === false)
            return;

        if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false /*|| !this._rootElement.parentNode*/)) {
            return;
        }

        Object.keys(this.children).forEach(child => {
            this.children[child].destroy();
        });

        hooks.callDestroy(this);
    }

    _initTemplate(opt) {
        if (typeof opt.cmp.cfg.template === 'string' && opt.app.cfg.enableExternalTemplate) {
            let contentTpl = opt.cmp.cfg.template;
            if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
                opt.cmp.cfg.template = function () {
                    let contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
                    return eval('`' + contentStr + '`')
                }
            } else {
                opt.cmp.cfg.template = function () {
                    contentTpl = toLiteralString(contentTpl);
                    return eval('`' + contentTpl + '`');
                }
            }
        }
    }

    _initRawProps(opt) {
        if (!this._isSubclass) {
            this._rawProps = Object.assign({},
                typeof opt.cmp.cfg.props === 'function'
                    ? opt.cmp.cfg.props()
                    : opt.cmp.cfg.props,
                opt.props
            );

            this._initTemplate(opt);

        } else {
            this._rawProps = Object.assign({}, opt.props);
        }
    }
}

function defineProperties(obj, opt) {

    Object.defineProperties(obj, {
        //Private
        _opt: {
            value: opt
        },
        _cfgRoot: {
            value: opt.root
        },
        _publicProps: {
            value: Object.assign({}, opt.props)
        },
        _initialProps: {
            value: cloneObject(obj._rawProps)
        },
        _callback: {
            value: opt.dProps['callback']
        },
        _isRendered: {
            value: false,
            writable: true
        },
        _prev: {
            value: null,
            writable: true
        },
        _rootElement: {
            value: null,
            writable: true
        },
        _parentElement: {
            value: null,
            writable: true
        },
        _boundElements: {
            value: {},
            writable: true
        },
        _components: {
            value: {},
            writable: true
        },
        _processing: {
            value: [],
            writable: true
        },
        _dynamicChildren: {
            value: [],
            writable: true
        },
        _unmounted: {
            value: false,
            writable: true
        },
        _unmountedParentNode: {
            value: null,
            writable: true
        },
        _configured: {
            value: false,
            writable: true
        },
        _props: {
            value: {},
            writable: true
        },
        _computedCache: {
            value: new Map()
        },
        _renderPause: {
            value: false,
            writable: true
        },
        _dynamicNodes: {
            value: {},
            enumerable: true
        },

        //Public
        tag: {
            value: opt.cmp.tag,
            enumerable: true
        },
        app: {
            value: opt.app,
            enumerable: true
        },
        parent: {
            value: opt.parentCmp,
            enumerable: true,
            configurable: true
        },
        appRoot: {
            value: opt.app._root,
            enumerable: true
        },
        action: {
            value: opt.app.action,
            enumerable: true
        },
        shared: {
            value: opt.app.shared,
            writable: true,
            enumerable: true
        },
        ref: {
            value: {},
            enumerable: true
        },
        children: {
            value: {},
            enumerable: true
        },
        childrenByTag: {
            value: {},
            enumerable: true
        },
        rawChildren: {
            value: [],
            enumerable: true
        },
        autoCreateChildren: {
            value: true,
            enumerable: true,
            writable: true
        },
        updateChildrenProps: {
            value: true,
            enumerable: true,
            writable: true
        },
        mixin: {
            value: [],
            enumerable: true,
            writable: true
        },
        propsConvertOnFly: {
            value: false,
            enumerable: true,
            writable: true
        },
        propsComputedOnFly: {
            value: false,
            enumerable: true,
            writable: true
        },
        delayUpdate: {
            value: 0,
            enumerable: true,
            writable: true
        }
    });
}

function drawDynamic(instance) {

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        if (!item.node.childNodes.length) {

            const dynamicInstance = require('./instances').get({
                root,
                template: item.node.outerHTML,
                app: instance.app,
                parent: instance
            });

            if (dynamicInstance) {
                root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
                dynamicInstance._rootElement.parentNode[INSTANCE] = dynamicInstance;
                instance._processing.splice(index, 1);
                let n = Object.keys(instance.children).length;
                instance.children[n++] = dynamicInstance;
                instance._dynamicNodes[item.node.dataset.key] = dynamicInstance._rootElement.parentNode;
            }
        }
        index -= 1;
    }
}

module.exports = {
    Component,
    defineProperties,
    drawDynamic
};