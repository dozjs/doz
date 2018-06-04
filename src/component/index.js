const extend = require('../utils/extend');
const {register} = require('../collection');
const html = require('../utils/html');
const {REGEX, TAG, INSTANCE, CMP_INSTANCE} = require('../constants');
const collection = require('../collection');
const observer = require('./observer');
const events = require('./events');
const {transform, serializeProps} = require('../vdom/parser');
const update = require('../vdom').updateElement;
const store = require('./store');
const ids = require('./ids');
const {extract} = require('./d-props');
const proxy = require('../utils/proxy');

function component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        autoCreateChildren: true,
        updateChildrenProps: true,
        props: {},
        template() {
            return ''
        }
    });

    register(cmp);
}

function getInstances(cfg = {}) {

    cfg.template = typeof cfg.template === 'string'
        ? html.create(cfg.template)
        : cfg.template;

    cfg.root.appendChild(cfg.template);

    let component = null;
    let parentElement;
    const trash = [];

    function walk(child, parent = {}) {
        while (child) {

            const cmp = cfg.autoCmp || collection.get(child.nodeName) || cfg.app._components[child.nodeName.toLowerCase()];

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

                const newElement = createInstance(cmp, {
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

                newElement.render(true);

                if (!component) {
                    component = newElement;
                }

                newElement._rootElement[CMP_INSTANCE] = newElement;

                if (events.callBeforeMount(newElement) !== false) {
                    child.insertBefore(newElement._rootElement, child.firstChild);

                    // This is deprecated in favor of onMount
                    events.callRender(newElement);
                    events.callMount(newElement);
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

function createInstance(cmp, cfg) {

    const props = extend.copy(cfg.props, typeof cmp.cfg.props === 'function'
        ? cmp.cfg.props()
        : cmp.cfg.props
    );

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
        _publicProps: {
            value: Object.assign({}, cfg.props)
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
        action: {
            value: cfg.app.action,
            enumerable: true
        },
        render: {
            value: function (initial) {
                this.beginSafeRender();
                const template = this.template().trim();
                this.endSafeRender();

                const tpl = html.create(template, TAG.ROOT);
                let next = transform(tpl);

                const rootElement = update(cfg.root, next, this._prev, 0, this, initial);

                drawDynamic(this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        mount: {
            value: function (template, cfg = {}) {
                if (events.callBeforeMount(this) === false)
                    return this;
                if (this._unmounted) {
                    this._unmountedParentNode.appendChild(this._rootElement.parentNode);
                    this._unmounted = false;
                    this._unmountedParentNode = null;
                    events.callMount(this);
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
            value: function (onlyInstance = false, byDestroy) {
                if (!onlyInstance && (Boolean(this._unmountedParentNode) || !this._rootElement  || events.callBeforeUnmount(this) === false || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode)) {
                    return false;
                }

                this._unmountedParentNode = this._rootElement.parentNode.parentNode;

                if (!onlyInstance) {
                    this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
                } else
                    this._rootElement.parentNode.innerHTML = '';

                this._unmounted = !byDestroy;

                events.callUnmount(this);
                //propagateUnmount(this);
                Object.keys(this.children).forEach(child => {
                    this.children[child].unmount();
                });

                return this;
            },
            enumerable: true
        },
        destroy: {
            value: function (onlyInstance) {
                if (!onlyInstance && (!this._rootElement || events.callBeforeDestroy(this) === false || !this._rootElement.parentNode)) {
                    console.warn('destroy failed');
                    return;
                }

                if (this.unmount(onlyInstance, true) === false)
                    return;

                Object.keys(this.children).forEach(child => {
                    this.children[child].destroy();
                });

                events.callDestroy(this);
            },
            enumerable: true
        }
    });

    // Assign cfg to instance
    extendInstance(instance, cmp.cfg, cfg.dProps);

    const beforeCreate = events.callBeforeCreate(instance);
    if (beforeCreate === false)
        return undefined;

    // Create observer to props
    observer.create(instance, props);
    // Create shared store
    store.create(instance);
    // Create ID
    ids.create(instance);
    // Add callback to ready queue
    queueReadyCB(instance);
    // Call create
    events.callCreate(instance);
    // Now instance is created
    instance._isCreated = true;

    return instance;
}

function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);
}

function queueReadyCB(instance) {
    if (typeof instance.onAppReady === 'function') {
        instance.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.onAppReady);
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

function drawDynamic(instance) {
    clearDynamic(instance);

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        if (item.node[INSTANCE]) {
            item.node[INSTANCE].destroy(true);
        }

        const dynamicInstance = getInstances({root, template: item.node.outerHTML, app: instance.app});

        if (dynamicInstance) {
            instance._dynamicChildren.push(dynamicInstance._rootElement.parentNode);

            root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
            dynamicInstance._rootElement.parentNode[INSTANCE] = dynamicInstance;
            instance._processing.splice(index, 1);
        }
        index -= 1;
    }
}

module.exports = {
    component,
    getInstances
};