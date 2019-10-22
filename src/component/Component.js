const {TAG, COMPONENT_ROOT_INSTANCE, REGEX} = require('../constants');
const observer = require('./observer');
const hooks = require('./hooks');
const update = require('../vdom').updateElement;
const drawDynamic = require('./helpers/draw-dynamic');
const proxy = require('../proxy');
const toInlineStyle = require('../utils/to-inline-style');
const queueReady = require('./helpers/queue-ready');
const queueDraw = require('./helpers/queue-draw');
const extendInstance = require('./helpers/extend-instance');
const removeAllAttributes = require('../utils/remove-all-attributes');
const h = require('../vdom/h');
const loadLocal = require('./helpers/load-local');
const localMixin = require('./helpers/local-mixin');
const {compile} = require('../vdom/parser');
const propsInit = require('./helpers/props-init');
const DOMManipulation = require('./DOMManipulation');
const directive = require('../directive');
const cloneObject = require('../utils/clone-object');
const toLiteralString = require('../utils/to-literal-string');
//const mapCompiled = require('../vdom/map-compiled');

class Component extends DOMManipulation {

    constructor(opt) {
        super(opt);

        Object.defineProperty(this, '_isSubclass', {
            value: this.__proto__.constructor !== Component
        });

        Object.defineProperty(this, 'uId', {
            value: this.app.generateUId(),
            enumerable: true
        });

        Object.defineProperty(this, '_h', {
            value: h.bind(this),
            enumerable: false
        });

        this._initRawProps(opt);

        // Assign cfg to instance
        extendInstance(this, opt.cmp.cfg);

        // Create mixin
        localMixin(this);

        // Load local components
        loadLocal(this);

        const beforeCreate = hooks.callBeforeCreate(this);
        if (beforeCreate === false)
            return;

        // Create observer to props
        observer.create(this, true);
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
        directive.callAppComponentSetProps(this);
    }

    get props() {
        return this._props;
    }

    loadProps(props) {
        if (typeof props !== 'object')
            throw new TypeError('Props must be an object');

        this._rawProps = Object.assign({}, props);
        propsInit(this);
        observer.create(this);
        hooks.callLoadProps(this);
    }

    set config(obj) {
        if (!this._isSubclass)
            throw new Error('Config is allowed only for classes');

        if (this._configured)
            throw new Error('Already configured');

        if (typeof obj !== 'object')
            throw new TypeError('Config must be an object');

        directive.callAppComponentSetConfig(this, obj);

        if (typeof obj.mixin === 'object') {
            this.mixin = obj.mixin;
            localMixin(this);
        }

        if (typeof obj.components === 'object') {
            this.components = obj.components;
            loadLocal(this);
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

    each(obj, func, safe = false) {
        //return obj.map(func);
        let res;
        if (Array.isArray(obj)) {
            if (safe) this.beginSafeRender();
            /*res = obj.map(func).map((stringEl, i) => {
                if (typeof stringEl === 'string') {
                    return stringEl.trim()
                }
            }).join('');*/
            res = obj.map(func);
            if (safe) this.endSafeRender();
        }
        return res;
    }

    // noinspection JSMethodCanBeStatic
    toStyle(obj) {
        return toInlineStyle(obj)
    }

    render(initial, changes = [], silentAfterRenderEvent = false) {
        if (this._renderPause) return;

        this.beginSafeRender();
        const template = this.template(this._h, this.props);
        this.endSafeRender();

        let next = template && typeof template === 'object'
            ? template
            : compile(template, this);

        this.app.emit('draw', next, this._prev, this);
        queueDraw.emit(this, next, this._prev);

        let isOverwritten = false;
        directive.callAppComponentRenderOverwrite(this, changes, next, this._prev, overwrite => {
            isOverwritten = overwrite;
        });

        if(!isOverwritten) {
            const rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial);

            //Remove attributes from component tag
            removeAllAttributes(this._cfgRoot, ['style', 'class']);

            if (!this._rootElement && rootElement) {
                this._rootElement = rootElement;
                this._parentElement = rootElement.parentNode;
            }
            this._prev = next;
        }

        if (!silentAfterRenderEvent)
            hooks.callAfterRender(this);

        drawDynamic(this);
        //mapCompiled.flush();
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
                this._rootElement[COMPONENT_ROOT_INSTANCE] = this;
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

    // noinspection JSMethodCanBeStatic
    template() {
        return '';
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
        //console.log(this._isSubclass)
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

        Object.defineProperty(this, '_initialProps', {
            value: cloneObject(this._rawProps)
        });

    }

}


module.exports = Component;
module.exports._Component = Component;