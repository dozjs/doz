const extend = require('../utils/extend');
const html = require('../utils/html');
const {TAG, CMP_INSTANCE, INSTANCE, REGEX} = require('../constants');
const collection = require('../collection');
const observer = require('./observer');
const hooks = require('./hooks');
const {transform, serializeProps} = require('../vdom/parser');
const update = require('../vdom').updateElement;
const store = require('./store');
const ids = require('./ids');
const {extract} = require('./d-props');
const proxy = require('../utils/proxy');
const toInlineStyle = require('../utils/to-inline-style');
const hmr = require('./hmr');
const style = require('./style');
const queueReady = require('./queue-ready');
const extendInstance = require('./extend-instance');
const cloneObject = require('../utils/clone-object');
const toLiteralString = require('../utils/to-literal-string');
const h = require('../vdom/h');

function get(cfg = {}) {

    if (!cfg.root) return;

    cfg.template = typeof cfg.template === 'string'
        ? html.create(cfg.template)
        : cfg.template;

    cfg.root.appendChild(cfg.template);

    let component = null;
    let parentElement;
    const trash = [];

    function walk(child, parent = {}) {
        while (child) {

            const cmpName = child.nodeName.toLowerCase();
            let localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            const cmp = cfg.autoCmp ||
                localComponents[cmpName] ||
                cfg.app._components[cmpName] ||
                collection.get(child.nodeName);

            if (cmp) {

                if (parent.cmp) {
                    const rawChild = child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push(child);
                    child = child.nextSibling;
                    continue;
                }

                const props = serializeProps(child);
                const dProps = extract(props);

                const newElement = create(cmp, {
                    root: child,
                    app: cfg.app,
                    props,
                    dProps,
                    parentCmp: parent.cmp
                });

                if (!newElement) {
                    child = child.nextSibling;
                    continue;
                }

                if (typeof newElement.module === 'object') {
                    hmr(newElement, newElement.module);
                }

                if (hooks.callBeforeMount(newElement) !== false) {
                    newElement.render(true);

                    if (!component) {
                        component = newElement;
                    }

                    newElement._rootElement[CMP_INSTANCE] = newElement;

                    child.insertBefore(newElement._rootElement, child.firstChild);

                    hooks.callRender(newElement);
                    hooks.callMount(newElement);
                    hooks.callMountAsync(newElement);
                }

                parentElement = newElement;

                if (parent.cmp) {
                    let n = Object.keys(parent.cmp.children).length;
                    parent.cmp.children[newElement.alias ? newElement.alias : n++] = newElement;
                }

                cfg.autoCmp = null;
            }

            if (child.hasChildNodes()) {
                walk(child.firstChild, {cmp: parentElement})
            }

            child = child.nextSibling;
        }
    }

    walk(cfg.template);

    trash.forEach(child => child.remove());

    return component;
}

function create(cmp, cfg) {

    const props = extend.copy(cfg.props,
        typeof cmp.cfg.props === 'function'
            ? cmp.cfg.props()
            : cmp.cfg.props
    );

    if (typeof cmp.cfg.template === 'string') {
        let contentTpl = cmp.cfg.template;
        if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
            cmp.cfg.template = function () {
                let contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
                return eval('`' + contentStr + '`')
            }
        } else {
            cmp.cfg.template = function () {
                contentTpl = toLiteralString(contentTpl);
                return eval('`' + contentTpl + '`');
            }
        }
    }

    const instance = Object.defineProperties({}, {
        _isCreated: {
            value: false,
            writable: true
        },
        _prevTpl: {
            value: null,
            writable: true
        },
        _prev: {
            value: null,
            writable: true
        },
        _prevProps: {
            value: null,
            writable: true
        },
        _rootElement: {
            value: null,
            writable: true
        },
        _boundElements: {
            value: {},
            writable: true
        },
        _callback: {
            value: cfg.dProps['callback'],
            writable: true
        },
        _cache: {
            value: new Map()
        },
        _loops: {
            value: {},
            writable: true
        },
        _components: {
            value: {},
            writable: true
        },
        _publicProps: {
            value: Object.assign({}, cfg.props)
        },
        _initialProps: {
            value: cloneObject(props)
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
        getHTMLElement: {
            value: function () {
                return this._rootElement.parentNode;
            },
            enumerable: true
        },
        beginSafeRender: {
            value: function () {
                proxy.beginRender(this.props)
            },
            enumerable: true
        },
        endSafeRender: {
            value: function () {
                proxy.endRender(this.props)
            },
            enumerable: true
        },
        app: {
            value: cfg.app,
            enumerable: true
        },
        parent: {
            value: cfg.parentCmp,
            enumerable: true
        },
        ref: {
            value: {},
            writable: true,
            enumerable: true
        },
        children: {
            value: {},
            writable: true,
            enumerable: true
        },
        rawChildren: {
            value: [],
            writable: true,
            enumerable: true
        },
        tag: {
            value: cmp.tag,
            enumerable: true
        },
        emit: {
            value: function (name, ...args) {
                if (this._callback && this._callback[name] !== undefined
                    && this.parent[this._callback[name]] !== undefined
                    && typeof this.parent[this._callback[name]] === 'function') {
                    this.parent[this._callback[name]].apply(this.parent, args);
                }
            },
            enumerable: true
        },
        each: {
            value: function (obj, func, safe = false) {
                let res;
                if (Array.isArray(obj)) {
                    if (safe) this.beginSafeRender();
                    res = obj.map(func).map(stringEl => {
                        if (typeof stringEl === 'string') {

                            return stringEl.trim()
                        }
                    }).join('');
                    if (safe) this.endSafeRender();
                }
                return res;
            },
            enumerable: true
        },
        toStyle: {
            value: function (obj) {
                return toInlineStyle(obj)
            },
            enumerable: true
        },
        getStore: {
            value: function (storeName) {
                return this.app.getStore(storeName);
            },
            enumerable: true
        },
        getComponentById: {
            value: function (id) {
                return this.app.getComponentById(id);
            },
            enumerable: true
        },
        getCmp: {
            value: function (id) {
                return this.app.getComponentById(id);
            },
            enumerable: true
        },
        appRoot: {
            value: cfg.app._root,
            enumerable: true
        },
        action: {
            value: cfg.app.action,
            enumerable: true
        },
        render: {
            value: function (initial) {
                this.beginSafeRender();
                const template = this.template(h).trim();
                this.endSafeRender();

                const tpl = html.create(template, TAG.ROOT);
                let next = transform(tpl);

                const rootElement = update(cfg.root, next, this._prev, 0, this, initial);

                setTimeout(() => {
                    drawDynamic(this);
                });

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        mount: {
            value: function (template, cfg = {}) {

                if (this._unmounted) {
                    if (hooks.callBeforeMount(this) === false)
                        return this;

                    this._unmountedParentNode.appendChild(this._rootElement.parentNode);
                    this._unmounted = false;
                    this._unmountedParentNode = null;

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

                    return this.app.mount(template, root, this);
                }
            },
            enumerable: true
        },
        unmount: {
            value: function (onlyInstance = false, byDestroy, silently) {
                if (!onlyInstance && (Boolean(this._unmountedParentNode) || !this._rootElement || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode)) {
                    return;
                }

                if (hooks.callBeforeUnmount(this) === false)
                    return false;

                this._unmountedParentNode = this._rootElement.parentNode.parentNode;

                if (!onlyInstance) {
                    this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
                } else
                    this._rootElement.parentNode.innerHTML = '';

                this._unmounted = !byDestroy;

                if (!silently)
                    hooks.callUnmount(this);

                Object.keys(this.children).forEach(child => {
                    this.children[child].unmount(onlyInstance, byDestroy, silently);
                });

                return this;
            },
            enumerable: true
        },
        destroy: {
            value: function (onlyInstance) {

                if (this.unmount(onlyInstance, true) === false)
                    return;

                if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false || !this._rootElement.parentNode)) {
                    return;
                }

                Object.keys(this.children).forEach(child => {
                    this.children[child].destroy();
                });

                hooks.callDestroy(this);
            },
            enumerable: true
        }
    });

    // Assign cfg to instance
    extendInstance(instance, cmp.cfg, cfg.dProps);

    const beforeCreate = hooks.callBeforeCreate(instance);
    if (beforeCreate === false)
        return undefined;

    // Create observer to props
    observer.create(instance, props);
    // Create shared store
    store.create(instance);
    // Create ID
    ids.create(instance);
    // Add callback to ready queue
    queueReady.add(instance);
    // Call create
    hooks.callCreate(instance);
    //Apply scoped style
    style.scoped(instance);

    // Now instance is created
    instance._isCreated = true;

    return instance;
}

function drawDynamic(instance) {
    clearDynamic(instance);

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        if (item.node[INSTANCE]) {
            item.node[INSTANCE].destroy(true);
        }

        if (item.node.innerHTML === '') {

            const dynamicInstance = require('./instances').get({
                root,
                template: item.node.outerHTML,
                app: instance.app
            });

            if (dynamicInstance) {
                instance._dynamicChildren.push(dynamicInstance._rootElement.parentNode);
                root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
                dynamicInstance._rootElement.parentNode[INSTANCE] = dynamicInstance;
                instance._processing.splice(index, 1);
            }
        }
        index -= 1;
    }
}

function clearDynamic(instance) {
    let index = instance._dynamicChildren.length - 1;

    while (index >= 0) {
        let item = instance._dynamicChildren[index];

        if (!document.body.contains(item) && item[INSTANCE]) {
            item[INSTANCE].destroy(true);
            instance._dynamicChildren.splice(index, 1);
        }
        index -= 1;
    }
}

module.exports = {
    create,
    get,
    clearDynamic,
    drawDynamic
};