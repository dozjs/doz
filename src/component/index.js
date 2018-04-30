const extend = require('../utils/extend');
const {register} = require('../collection');
const html = require('../utils/html');
const {REGEX, TAG} = require('../constants');
const collection = require('../collection');
const observer = require('./observer');
const events = require('./events');
const {transform, serializeProps} = require('../vdom/parser');
const update = require('../vdom').updateElement;
const store = require('./store');
const ids = require('./ids');
const {extract} = require('./d-props');

function makeId() {
    return `doz-${performance.now()}-${Math.random()}`.replace(/\./g,'-');
}

function component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-): my-component');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        updateChildrenProps: true,
        props: {},
        template() {
            return '<div></div>'
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

    function walk(child, parent = {}) {
        while (child) {

            const cmp = cfg.autoCmp || collection.get(child.nodeName) || cfg.view._components[child.nodeName.toLowerCase()];

            if (cmp) {

                const props = serializeProps(child);
                const dProps = extract(props);

                const newElement = createInstance(cmp, {
                    root: child,
                    view: cfg.view,
                    props,
                    dProps,
                    parentCmp: parent.cmp,
                    isStatic: cfg.isStatic
                });

                if (!newElement) {
                    continue;
                }

                newElement.render();

                if (!component) {
                    component = newElement;
                }

                child.insertBefore(newElement._rootElement, child.firstChild);
                events.callRender(newElement);
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
            value: new Map()
        },
        _isStatic: {
            value: cfg.isStatic
        },
        _publicProps: {
            value: Object.assign({}, cfg.props)
        },
        view: {
            value: cfg.view,
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
            value: function (obj, func) {
                console.log('ID', makeId());
                if (Array.isArray(obj))
                    return obj.map(func).map(stringEl => {

                        stringEl = stringEl.trim();
                        const isCustomTagString = stringEl.match(REGEX.IS_CUSTOM_TAG_STRING);

                        if (isCustomTagString) {
                            const key = stringEl;
                            const value = this._cache.get(key);
                            if (value !== undefined) {
                                stringEl = value;
                            } else {
                                const cmp = getInstances({
                                    root: document.createElement(TAG.ROOT),
                                    template: stringEl,
                                    view: this.view,
                                    parentCmp: this,
                                    isStatic: true
                                });
                                stringEl = cmp._rootElement.innerHTML;
                                cmp.destroy();
                                this._cache.set(key, stringEl);
                            }
                        }

                        return stringEl
                    }).join('').trim();
            },
            enumerable: true
        },
        getStore: {
            value: function (storeName) {
                return this.view.getStore(storeName);
            },
            enumerable: true
        },
        getComponentById: {
            value: function (id) {
                return this.view.getComponentById(id);
            },
            enumerable: true
        },
        action: {
            value: cfg.view.action,
            enumerable: true
        },
        render: {
            value: function () {
                const tag = this.tag ? this.tag + TAG.SUFFIX_ROOT : TAG.ROOT;
                const template = this.template().trim();
                const tpl = html.create(`<${tag}>${template}</${tag}>`);
                let next = transform(tpl);

                const rootElement = update(cfg.root, next, this._prev, 0, this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        mount: {
            value: function (template, cfg = {}) {
                let root = this._rootElement;
                if (typeof cfg.selector === 'string')
                    root = root.querySelector(cfg.selector);
                return this.view.mount(template, root, this);
            },
            enumerable: true
        },
        destroy: {
            value: function () {
                if (!this._rootElement || events.callBeforeDestroy(this) === false
                    || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode) {
                    console.warn('destroy failed');
                    return;
                }
                this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
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
    // Call create
    events.callCreate(instance);
    // Now instance is created
    instance._isCreated = true;

    return instance;
}

function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);
}

module.exports = {
    component,
    getInstances
};