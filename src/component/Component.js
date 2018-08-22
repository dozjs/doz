const extend = require('../utils/extend');
const html = require('../utils/html');
const {TAG, CMP_INSTANCE, INSTANCE, REGEX} = require('../constants');
const observer = require('./observer');
const hooks = require('./hooks');
const {transform} = require('../vdom/parser');
const update = require('../vdom').updateElement;
const store = require('./store');
const ids = require('./ids');
const proxy = require('../utils/proxy');
const toInlineStyle = require('../utils/to-inline-style');
const style = require('./style');
const queueReady = require('./queue-ready');
const extendInstance = require('./extend-instance');
const cloneObject = require('../utils/clone-object');
const toLiteralString = require('../utils/to-literal-string');
const h = require('../vdom/h');

class Component {
    /**
     * @return {*}
     */
    constructor(cmp, cfg) {

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

        // Private
        this._cfgRoot = cfg.root;
        this._isCreated = false;
        this._prevTpl = null;
        this._prev = null;
        this._prevProps = null;
        this._rootElement = null;
        this._boundElements = {};
        this._callback = cfg.dProps['callback'];
        this._cache = new Map();
        this._loops = {};
        this._components = {};
        this._publicProps = Object.assign({}, cfg.props);
        this._initialProps = cloneObject(props);
        this._processing = [];
        this._dynamicChildren = [];
        this._unmounted = false;
        this._unmountedParentNode = null;

        // Public
        this.app = cfg.app;
        this.parent = cfg.parentCmp;
        this.ref = {};
        this.children = {};
        this.rawChildren = [];
        this.tag = cmp.tag;
        this.appRoot = cfg.app._root;
        this.action = cfg.app.action;
        this.props = {};

        let instance = this;

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

        return this;

    }

    getHTMLElement() {
        return this._rootElement.parentNode;
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
            res = obj.map(func).map(stringEl => {
                if (typeof stringEl === 'string') {
                    return stringEl.trim()
                }
            }).join('');
            if (safe) this.endSafeRender();
        }
        return res;
    }

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

    template() {
        return '';
    }

    render(initial) {
        this.beginSafeRender();
        const template = this.template(h).trim();
        this.endSafeRender();

        const tpl = html.create(template, TAG.ROOT);
        let next = transform(tpl);

        const rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial);

        setTimeout(() => {
            drawDynamic(this);
        });

        if (!this._rootElement && rootElement) {
            this._rootElement = rootElement;
        }

        this._prev = next;
    }

    mount(template, cfg = {}) {

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
    }

    unmount(onlyInstance = false, byDestroy, silently) {
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
    }

    destroy(onlyInstance) {

        if (this.unmount(onlyInstance, true) === false)
            return;

        if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false || !this._rootElement.parentNode)) {
            return;
        }

        Object.keys(this.children).forEach(child => {
            this.children[child].destroy();
        });

        hooks.callDestroy(this);
    }

    static define() {

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
    Component,
    clearDynamic,
    drawDynamic
};