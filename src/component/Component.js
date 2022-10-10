import {
    COMPONENT_DYNAMIC_INSTANCE, COMPONENT_INSTANCE,
    COMPONENT_ROOT_INSTANCE,
    DEFAULT_SLOT_KEY,
    PROPS_ATTRIBUTES,
    REGEX,
    TAG
} from "../constants.js";
import observer from "./observer.js";
import hooks from "./hooks.js";
import { updateElement } from "../vdom/index.js";
//import drawDynamic from "./helpers/drawDynamic.js";
import proxy from "../proxy.js";
import toInlineStyle from "../utils/toInlineStyle.js";
import queueReady from "./helpers/queue-ready.js";
import queueDraw from "./helpers/queueDraw.js";
import extendInstance from "./helpers/extendInstance.js";
//import removeAllAttributes from "../utils/removeAllAttributes.js";
import h from "../vdom/h.js";
import loadLocal from "./helpers/loadLocal.js";
import localMixin from "./helpers/localMixin.js";
import { compile } from "../vdom/parser.js";
import propsInit from "./helpers/propsInit.js";
//import DOMManipulation from "./DOMManipulation.js";
import directive from "../directives/index.js";
//import cloneObject from "../utils/cloneObject.js";
import deepCopy from "../utils/deepCopy.js";
import toLiteralString from "../utils/toLiteralString.js";
import delay from "../utils/delay.js";
import makeSureAttach from "./makeSureAttach.js";
import data from "../data.js";
import doCreateInstance from "./doCreateInstance.js";
import composeStyleInner from "../utils/composeStyleInner.js";
import canDecode from "../utils/canDecode.js";
import {isDirective} from "../directives/helpers.js";
import dashToCamel from "../utils/dashToCamel.js";
//const mapCompiled = require('../vdom/map-compiled');

class Component /*extends DOMManipulation */{
    constructor(opt = {}) {
        //super(opt);
        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };
        opt.app = opt.app || {};
        this._opt = opt;
        this._cfgRoot = opt.root;
        //this._publicProps = Object.assign({}, opt.props);
        this._publicProps = opt.props;
        this._isRendered = false;
        this._prev = null;
        this._rootElement = null;
        this._parentElement = null;
        this._components = {};
        this._processing = [];
        this._dynamicChildren = [];
        this._unmounted = false;
        this._unmountedParentNode = null;
        this._configured = false;
        this._props = {};
        this._directiveProps = null;
        this._computedCache = new Map();
        this._renderPause = false;
        //this._rawHTML = '';
        this._hasSlots = false;
        this._slots = {};
        this._defaultSlot = null;
        this._localComponentLastId = 0;
        //this._currentStyle = '';
        this._componentsMap = new Map();
        this.tag = opt.cmp.tag;
        this.app = opt.app;
        this.exposeAttributes = ['style', 'class'];
        this.parent = opt.parentCmp;
        this.appRoot = opt.app._root;
        this.action = opt.app.action;
        this.shared = opt.app.shared;
        //this.childrenToWalk = [];
        this._childrenInc = 0;
        this.children = {};
        this.childrenByTag = {};
        this.rawChildren = [];
        this.rawChildrenVnode = [];
        this.autoCreateChildren = true;
        this.updateChildrenProps = true;
        this.mixin = [];
        this.propsConvertOnFly = false;
        this.propsComputedOnFly = false;
        this.delayUpdate = 0;
        //this.propsData = {};
        this.lockRemoveInstanceByCallback = null;
        this.waitMount = false;
        this._isSubclass = this.__proto__.constructor !== Component;
        this.uId = this.app.generateUId();
        this.h = h.bind(this);

        this._initRawProps(opt);
        // Assign cfg to instance
        extendInstance(this, opt.cmp.cfg);
        // Create mixin
        localMixin(this);
        // Load local components
        loadLocal(this);
        const beforeCreate = hooks.callBeforeCreate(this);
        if (beforeCreate === false) {
            this.__beforeCreateReturnsFalse = true;
            return;
        }
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
        this.app.emit('componentSetProps', this);
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
        proxy.beginRender(this.props);
    }
    endSafeRender() {
        proxy.endRender(this.props);
    }
    each(obj, func, safe = false) {
        //return obj.map(func);
        let res;
        if (Array.isArray(obj)) {
            if (safe)
                this.beginSafeRender();
            /*res = obj.map(func).map((stringEl, i) => {
                if (typeof stringEl === 'string') {
                    return stringEl.trim()
                }
            }).join('');*/
            res = obj.map(func);
            if (safe)
                this.endSafeRender();
        }
        return res;
    }
    // noinspection JSMethodCanBeStatic
    toStyle(obj, withStyle = true) {
        return toInlineStyle(obj, withStyle);
    }
    render(initial, changes = [], silentAfterRenderEvent = false) {
        if (this._renderPause)
            return;
        this.beginSafeRender();
        //const propsKeys = Object.keys(this.props);
        //const templateArgs = [this.h];
        /*for (let i = 0; i < propsKeys.length; i++) {
            templateArgs.push(this.props[propsKeys[i]]);
        }*/
        //const template = this.template.apply(this, templateArgs);
        let template = this.template(this.h);
        this.endSafeRender();
        let next = template && typeof template === 'object'
            ? template
            : compile(template, this);
        this.app.emit('draw', next, this._prev, this);
        queueDraw.emit(this, next, this._prev);
        //console.log(next)
        //console.log(this._prev)
        const rootElement = updateElement(this._cfgRoot, next, this._prev, 0, this, initial);
        //Remove attributes from component tag
        //removeAllAttributes(this._cfgRoot, ['style', 'class'/*, 'key'*/, 'title']);
        /*if (!this._mainComponentByAppCreate)
            removeAllAttributes(this._cfgRoot, this.exposeAttributes);*/
        //console.log(this._rootElement)
        if (!this._rootElement && rootElement) {
            this._rootElement = rootElement;
            makeSureAttach(this._rootElement);
            this._parentElement = rootElement.parentNode;
            if (this.__hasStyle) {
                if (this._parentElement.dataset) {
                    this._parentElement.dataset.uid = this.uId;
                }
                else {
                    // prendo l'elemento dopo style
                    this._parentElement.firstElementChild.nextElementSibling.dataset.uid = this.uId;
                    //console.log(this.getHTMLElement())
                }
            }
        }
        this._prev = next;
        //console.log(this._prev)
        /*if (!silentAfterRenderEvent)
            hooks.callAfterRender(this);*/
        //drawDynamic(this);
    }
    renderPause() {
        this._renderPause = true;
    }
    renderResume(callRender = true) {
        this._renderPause = false;
        if (callRender)
            this.render();
    }
    prepareCommit() {
        //proxy.disableDOMDelayBegin(this.props);
        proxy.pause(this.props);
        this.renderPause();
    }
    commit() {
        //delay(() => this.renderResume());
        this.renderResume();
        proxy.resume(this.props);
        //proxy.disableDOMDelayEnd(this.props);
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
        }
        else if (template) {
            let root = this._rootElement;
            if (typeof cfg.selector === 'string')
                root = root.querySelector(cfg.selector);
            else if (cfg.selector instanceof HTMLElement)
                root = cfg.selector;
            else if (this._rootElement.nodeType !== 1) {
                /*const newElement = document.createElement(this.tag + TAG.SUFFIX_ROOT);
                newElement._dozAttach = {};
                this._rootElement.parentNode.replaceChild(newElement, this._rootElement);
                this._rootElement = newElement;
                this._rootElement._dozAttach[COMPONENT_ROOT_INSTANCE] = this;
                root = this._rootElement;*/
                root = this.getHTMLElement();
            }
            this._unmounted = false;
            this._unmountedParentNode = null;
            this._unmountedPlaceholder = null;
            return this.app.mount(template, root, this);
        }
    }
    unmount(onlyInstance = false, byDestroy, silently) {
        if (this.lockRemoveInstanceByCallback && typeof this.lockRemoveInstanceByCallback === 'function') {
            this.lockRemoveInstanceByCallback(this.unmount, onlyInstance, byDestroy, silently);
            return;
        }
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
        }
        else if (this._rootElement.parentNode) {
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
        if (this.lockRemoveInstanceByCallback && typeof this.lockRemoveInstanceByCallback === 'function') {
            this.lockRemoveInstanceByCallback(this.destroy, onlyInstance);
            return;
        }
        if (this.unmount(onlyInstance, true) === false) {
            return;
        }
        if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false /*|| !this._rootElement.parentNode*/)) {
            return;
        }
        //console.log(this.tag, Object.keys(this.children))
        Object.keys(this.children).forEach(child => {
                this.children[child].destroy();
        });
        hooks.callDestroy(this);
        if (this.parent && this.parent.children) {
            for (let i in this.parent.children) {
                if (this.parent.children.hasOwnProperty(i) && this === this.parent.children[i]) {
                    delete this.parent.children[i];
                }
            }
            if (this.parent.childrenByTag[this.tag]) {
                let indexOfThis = this.parent.childrenByTag[this.tag].indexOf(this);
                if (indexOfThis !== -1) {
                    this.parent.childrenByTag[this.tag].splice(indexOfThis, 1);
                }
            }
        }
        return true;
    }
    // noinspection JSMethodCanBeStatic
    template() {
        return '';
    }
    /*_initTemplate(opt) {
        if (typeof opt.cmp.cfg.template === 'string' && opt.app.cfg.enableExternalTemplate) {
            let contentTpl = opt.cmp.cfg.template;
            if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
                opt.cmp.cfg.template = function () {
                    let contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
                    return eval('`' + contentStr + '`');
                };
            }
            else {
                opt.cmp.cfg.template = function () {
                    contentTpl = toLiteralString(contentTpl);
                    return eval('`' + contentTpl + '`');
                };
            }
        }
    }*/
    _initRawProps(opt) {
        //console.log(this._isSubclass)
        if (!this._isSubclass) {
            this._rawProps = Object.assign({}, typeof opt.cmp.cfg.props === 'function'
                ? opt.cmp.cfg.props()
                : opt.cmp.cfg.props, opt.props);
            //this._initTemplate(opt);
        }
        else {
            this._rawProps = Object.assign({}, opt.props);
        }
        this._initialProps = deepCopy(this._rawProps);
        /*Object.defineProperty(this, '_initialProps', {
            value: cloneObject(this._rawProps)
        });*/
    }
    getDozWebComponentById(id) {
        return this.getWebComponentById(id);
    }
    getDozWebComponentByTag(name) {
        return this.getWebComponentByTag(name);
    }
    getWebComponentById(id) {
        return data.webComponents.ids[id] || null;
    }
    getWebComponentByTag(name) {
        return data.webComponents.tags[name] || null;
    }
    _setProps(obj) {
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                this.props[p] = obj[p];
            }
        }
    }
    setProps(obj) {
        this.prepareCommit();
        this._setProps(obj);
        this.commit();
    }
    setPropsAsync(obj) {
        delay(() => this._setProps(obj));
    }
    $$afterNodeElementCreate($el, node, initial, cmp) {
        if ($el._dozAttach.hasDirective) {
            directive.callAppDOMElementCreate(this, $el, node, initial);
            directive.callComponentDOMElementCreate(this, $el, initial);
        }
        //console.log('element created', $el.outerHTML)
        //this._canWalk = false;
        //console.log('NODO CREATO', $el.nodeName, 'da elaborare:', node.type.indexOf('-') !== -1,  'fa parte di:', this.tag);
        //console.log('......', $el.nodeName)
        if (typeof $el.hasAttribute === 'function') {
            if (node.type.indexOf('-') !== -1) {
                doCreateInstance(this, $el);
                //return;
            }

            //console.log(node.type, $el.nodeName)
            //if ($el.nodeName === TAG.SLOT_UPPERCASE) {
            if (node.type === TAG.SLOT) {
                let slotName = $el._dozAttach[PROPS_ATTRIBUTES] ? $el._dozAttach[PROPS_ATTRIBUTES].name : null;
                if (!slotName) {
                    this._defaultSlot = $el;
                    slotName = DEFAULT_SLOT_KEY;
                }
                if (this._slots[slotName] === undefined) {
                    this._slots[slotName] = [$el];
                }
                else {
                    this._slots[slotName].push($el);
                }
                this._hasSlots = true;
            }
        }
    }
    // noinspection JSMethodCanBeStatic
    $$beforeNodeChange($parent, $oldElement, newNode, oldNode) {
        if (typeof newNode === 'string' && typeof oldNode === 'string' && $oldElement) {
            if ($parent.nodeName === 'SCRIPT') {
                // it could be heavy
                if ($parent.type === 'text/style' && $parent._dozAttach.styleData.id && $parent._dozAttach.styleData.owner && document.getElementById($parent._dozAttach.styleData.id)) {
                    document.getElementById($parent._dozAttach.styleData.id).textContent = composeStyleInner(newNode, $parent._dozAttach.styleData.ownerByData);
                }
            }
            else {
                $oldElement.textContent = canDecode(newNode);
            }
            return $oldElement;
        }
    }
    // noinspection JSMethodCanBeStatic
    $$afterNodeChange($newElement, $oldElement) {
        makeSureAttach($oldElement);
        makeSureAttach($newElement);
        //Re-assign CMP COMPONENT_DYNAMIC_INSTANCE to new element
        if ($oldElement._dozAttach[COMPONENT_ROOT_INSTANCE]) {
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE] = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE];
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement = $newElement;
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE].uId;
        }
    }
    // noinspection JSMethodCanBeStatic
    $$beforeNodeWalk($parent, index, attributesUpdated) {
        if ($parent.childNodes[index]) {
            makeSureAttach($parent.childNodes[index]);
            const dynInstance = $parent.childNodes[index]._dozAttach[COMPONENT_DYNAMIC_INSTANCE];
            // Can update props of dynamic instances?
            if (dynInstance && attributesUpdated.length) {
                attributesUpdated.forEach(props => {
                    Object.keys(props).forEach(name => {
                        dynInstance.props[name] = props[name];
                    });
                });
                return true;
            }
        }
        return false;
    }
    // noinspection JSMethodCanBeStatic
    /*$$afterAttributeCreate($target, name, value, nodeProps) {
    }*/
    // noinspection JSMethodCanBeStatic
    /*$$afterAttributesCreate($target, bindValue) {
    }*/
    $$afterAttributeUpdate($target, name, value) {
        let _isDirective = isDirective(name);
        if (this.updateChildrenProps && $target) {
            //name = REGEX.IS_DIRECTIVE.test(name) ? name : dashToCamel(name);
            name = _isDirective ? name : dashToCamel(name);
            const firstChild = $target.firstChild;
            makeSureAttach(firstChild);
            if (firstChild && firstChild._dozAttach[COMPONENT_ROOT_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild._dozAttach[COMPONENT_ROOT_INSTANCE]._publicProps, name)) {
                firstChild._dozAttach[COMPONENT_ROOT_INSTANCE].props[name] = value;
            }
            else if ($target._dozAttach[COMPONENT_INSTANCE]) {
                $target._dozAttach[COMPONENT_INSTANCE].props[name] = value;
            }
        }
        directive.callComponentDOMElementUpdate(this, $target);
        //if ($target && REGEX.IS_DIRECTIVE.test(name)) {
        if ($target && _isDirective) {
            $target.removeAttribute(name);
        }
    }
}
export default Component;
export { Component as _Component };
