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
    constructor(opt) {
        if (opt.cmp) {
            this._props = extend.copy(opt.props,
                typeof opt.cmp.cfg.props === 'function'
                    ? opt.cmp.cfg.props()
                    : opt.cmp.cfg.props
            );

            if (typeof opt.cmp.cfg.template === 'string') {
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
        } else {
            this._props = Object.assign({}, opt.props);
            opt.cmp = {
                tag: null,
                cfg: {}
            }
        }

        // Private
        this._cfgRoot = opt.root;
        this._publicProps = Object.assign({}, opt.props);
        this._initialProps = cloneObject(this._props);
        this._callback = opt.dProps['callback'];
        this._isCreated = false;
        this._prev = null;
        this._rootElement = null;
        this._boundElements = {};
        this._components = {};
        this._processing = [];
        this._dynamicChildren = [];
        this._unmounted = false;
        this._unmountedParentNode = null;

        // Public
        this.tag = opt.cmp.tag;
        this.app = opt.app;
        this.parent = opt.parentCmp;
        this.appRoot = opt.app._root;
        this.action = opt.app.action;
        this.ref = {};
        this.children = {};
        this.rawChildren = [];
        this.props = {};
        this.autoCreateChildren = true;
        this.updateChildrenProps = true;

        // Assign cfg to instance
        extendInstance(this, opt.cmp.cfg, opt.dProps);

        const beforeCreate = hooks.callBeforeCreate(this);
        if (beforeCreate === false)
            return undefined;

        // Create observer to props
        observer.create(this);
        // Create shared store
        store.create(this);
        // Create ID
        ids.create(this);
        // Add callback to ready queue
        queueReady.add(this);
        // Call create
        hooks.callCreate(this);
        //Apply scoped style
        style.scoped(this);

        // Now instance is created
        this._isCreated = true;

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