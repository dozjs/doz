// [DOZ]  Build version: 1.5.0  
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Doz", [], factory);
	else if(typeof exports === 'object')
		exports["Doz"] = factory();
	else
		root["Doz"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    INSTANCE: '__DOZ_INSTANCE__',
    CMP_INSTANCE: '__DOZ_CMP_INSTANCE__',
    NS: {
        SVG: 'http://www.w3.org/2000/svg'
    },
    TAG: {
        ROOT: 'dz-root',
        EACH: 'dz-each-root',
        APP: 'dz-app',
        EMPTY: 'dz-empty',
        MOUNT: 'dz-mount',
        SUFFIX_ROOT: '-root',
        TEXT_NODE_PLACE: 'dz-text-node'
    },
    REGEX: {
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
        IS_BIND: /^d-bind$/,
        IS_REF: /^d-ref$/,
        IS_ALIAS: /^d:alias$/,
        IS_STORE: /^d:store$/,
        IS_COMPONENT_LISTENER: /^d:on-(\w+)$/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        IS_PARENT_METHOD: /^parent.(.*)/,
        IS_STRING_QUOTED: /^"\w+"/,
        GET_LISTENER: /^this.(.*)\((.*)\)/,
        TRIM_QUOTES: /^["'](.*)["']$/,
        THIS_TARGET: /\B\$this(?!\w)/g
    },
    ATTR: {
        // Attributes for HTMLElement
        BIND: 'd-bind',
        REF: 'd-ref',
        // Attributes for Components
        ALIAS: 'd:alias',
        STORE: 'd:store',
        LISTENER: 'd:on',
        ID: 'd:id',
        FORCE_UPDATE: 'forceupdate'
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var data = __webpack_require__(22);

/**
 * Register a component to global
 * @param cmp
 */
function registerComponent(cmp) {

    var tag = cmp.tag.toUpperCase();

    if (Object.prototype.hasOwnProperty.call(data.components, tag)) console.warn('Doz', 'component ' + tag + ' overwritten');

    data.components[tag] = cmp;
}

/**
 * Remove all global components
 */
function removeAll() {
    data.components = {};
    data.plugins = [];
}

/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function getComponent(tag) {
    tag = tag.toUpperCase();
    return data.components[tag];
}

/**
 * Register a plugin to global
 * @param plugin
 */
function registerPlugin(plugin) {
    data.plugins.push(plugin);
}

module.exports = {
    registerComponent: registerComponent,
    registerPlugin: registerPlugin,
    getComponent: getComponent,
    removeAll: removeAll,
    data: data
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var deprecate = __webpack_require__(23);

function callBeforeCreate(context) {
    if (typeof context.onBeforeCreate === 'function') {
        return context.onBeforeCreate.call(context);
    }
}

function callCreate(context) {
    if (typeof context.onCreate === 'function') {
        context.onCreate.call(context);
    }
}

function callConfigCreate(context) {
    if (typeof context.onConfigCreate === 'function') {
        context.onConfigCreate.call(context);
    }
}

function callRender(context) {
    if (typeof context.onRender === 'function') {
        deprecate.once('onRender is deprecated since v. 1.0.0, use onMount instead');
        context.onRender.call(context);
    }
}

function callBeforeMount(context) {
    if (typeof context.onBeforeMount === 'function') {
        return context.onBeforeMount.call(context);
    }
}

function callMount(context) {
    if (typeof context.onMount === 'function') {
        context.onMount.call(context);
    }
}

function callMountAsync(context) {
    if (typeof context.onMountAsync === 'function') {
        setTimeout(function () {
            context.onMountAsync.call(context);
        });
    }
}

function callBeforeUpdate(context, changes) {
    if (typeof context.onBeforeUpdate === 'function') {
        return context.onBeforeUpdate.call(context, changes);
    }
}

function callUpdate(context, changes) {
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context, changes);
    }
}

function callBeforeUnmount(context) {
    if (typeof context.onBeforeUnmount === 'function') {
        return context.onBeforeUnmount.call(context);
    }
}

function callUnmount(context) {
    if (typeof context.onUnmount === 'function') {
        context.onUnmount.call(context);
    }
}

function callBeforeDestroy(context) {
    if (typeof context.onBeforeDestroy === 'function') {
        return context.onBeforeDestroy.call(context);
    }
}

function callDestroy(context) {
    if (typeof context.onDestroy === 'function') {
        context.onDestroy.call(context);
        context = null;
    }
}

module.exports = {
    callBeforeCreate: callBeforeCreate,
    callCreate: callCreate,
    callConfigCreate: callConfigCreate,
    callRender: callRender,
    callBeforeMount: callBeforeMount,
    callMount: callMount,
    callMountAsync: callMountAsync,
    callBeforeUpdate: callBeforeUpdate,
    callUpdate: callUpdate,
    callBeforeUnmount: callBeforeUnmount,
    callUnmount: callUnmount,
    callBeforeDestroy: callBeforeDestroy,
    callDestroy: callDestroy
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = __webpack_require__(4);

var _require = __webpack_require__(0),
    TAG = _require.TAG,
    CMP_INSTANCE = _require.CMP_INSTANCE,
    INSTANCE = _require.INSTANCE,
    REGEX = _require.REGEX;

var observer = __webpack_require__(26);
var hooks = __webpack_require__(2);
var update = __webpack_require__(27).updateElement;
var store = __webpack_require__(31);
var ids = __webpack_require__(32);
var proxy = __webpack_require__(10);
var toInlineStyle = __webpack_require__(13);
var style = __webpack_require__(33);
var queueReady = __webpack_require__(35);
var queueDraw = __webpack_require__(36);
var extendInstance = __webpack_require__(37);
var cloneObject = __webpack_require__(38);
var toLiteralString = __webpack_require__(14);
var h = __webpack_require__(15);
var loadLocal = __webpack_require__(39);
var localMixin = __webpack_require__(40);
var compile = __webpack_require__(43);

var Component = function () {
    function Component(opt) {
        _classCallCheck(this, Component);

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

        var beforeCreate = hooks.callBeforeCreate(this);
        if (beforeCreate === false) return;

        // Create observer to props
        observer.create(this);
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
        //Apply scoped style
        style.scoped(this);

        // Now instance is created
        this._isCreated = true;
    }

    _createClass(Component, [{
        key: 'getHTMLElement',
        value: function getHTMLElement() {
            return this._rootElement.parentNode;
        }
    }, {
        key: 'beginSafeRender',
        value: function beginSafeRender() {
            proxy.beginRender(this.props);
        }
    }, {
        key: 'endSafeRender',
        value: function endSafeRender() {
            proxy.endRender(this.props);
        }
    }, {
        key: 'emit',
        value: function emit(name) {
            if (this._callback && this._callback[name] !== undefined && this.parent[this._callback[name]] !== undefined && typeof this.parent[this._callback[name]] === 'function') {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                this.parent[this._callback[name]].apply(this.parent, args);
            }
        }
    }, {
        key: 'each',
        value: function each(obj, func) {
            var safe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var res = void 0;
            if (Array.isArray(obj)) {
                if (safe) this.beginSafeRender();
                res = obj.map(func).map(function (stringEl) {
                    if (typeof stringEl === 'string') {
                        return stringEl.trim();
                    }
                }).join('');
                if (safe) this.endSafeRender();
            }
            return res;
        }
    }, {
        key: 'toStyle',
        value: function toStyle(obj) {
            return toInlineStyle(obj);
        }
    }, {
        key: 'getStore',
        value: function getStore(storeName) {
            return this.app.getStore(storeName);
        }
    }, {
        key: 'getComponentById',
        value: function getComponentById(id) {
            return this.app.getComponentById(id);
        }
    }, {
        key: 'getCmp',
        value: function getCmp(id) {
            return this.app.getComponentById(id);
        }
    }, {
        key: 'template',
        value: function template() {
            return '';
        }
    }, {
        key: 'render',
        value: function render(initial) {
            var _this = this;

            this.beginSafeRender();
            var template = this.template(h);
            this.endSafeRender();

            var next = compile(template);

            this.app.emit('draw', next, this._prev, this);
            queueDraw.emit(this, next, this._prev);

            var rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial);

            setTimeout(function () {
                drawDynamic(_this);
            });

            if (!this._rootElement && rootElement) {
                this._rootElement = rootElement;
            }

            this._prev = next;
        }
    }, {
        key: 'mount',
        value: function mount(template) {
            var _this2 = this;

            var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            if (this._unmounted) {
                if (hooks.callBeforeMount(this) === false) return this;

                this._unmountedParentNode.appendChild(this._rootElement.parentNode);
                this._unmounted = false;
                this._unmountedParentNode = null;

                hooks.callMount(this);

                Object.keys(this.children).forEach(function (child) {
                    _this2.children[child].mount();
                });

                return this;
            } else if (template) {
                if (this._rootElement.nodeType !== 1) {
                    var newElement = document.createElement(this.tag + TAG.SUFFIX_ROOT);
                    this._rootElement.parentNode.replaceChild(newElement, this._rootElement);
                    this._rootElement = newElement;
                    this._rootElement[CMP_INSTANCE] = this;
                }

                var root = this._rootElement;

                if (typeof cfg.selector === 'string') root = root.querySelector(cfg.selector);else if (cfg.selector instanceof HTMLElement) root = cfg.selector;

                this._unmounted = false;
                this._unmountedParentNode = null;
                return this.app.mount(template, root, this);
            }
        }
    }, {
        key: 'unmount',
        value: function unmount() {
            var onlyInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var _this3 = this;

            var byDestroy = arguments[1];
            var silently = arguments[2];

            if (!onlyInstance && (Boolean(this._unmountedParentNode) || !this._rootElement || !this._rootElement.parentNode || !this._rootElement.parentNode.parentNode)) {
                return;
            }

            if (hooks.callBeforeUnmount(this) === false) return false;

            this._unmountedParentNode = this._rootElement.parentNode.parentNode;

            if (!onlyInstance) {
                this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
            } else this._rootElement.parentNode.innerHTML = '';

            this._unmounted = !byDestroy;

            if (!silently) hooks.callUnmount(this);

            Object.keys(this.children).forEach(function (child) {
                _this3.children[child].unmount(onlyInstance, byDestroy, silently);
            });

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy(onlyInstance) {
            var _this4 = this;

            if (this.unmount(onlyInstance, true) === false) return;

            if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false || !this._rootElement.parentNode)) {
                return;
            }

            Object.keys(this.children).forEach(function (child) {
                _this4.children[child].destroy();
            });

            hooks.callDestroy(this);
        }
    }, {
        key: '_initTemplate',
        value: function _initTemplate(opt) {
            if (typeof opt.cmp.cfg.template === 'string') {
                var contentTpl = opt.cmp.cfg.template;
                if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
                    opt.cmp.cfg.template = function () {
                        var contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
                        return eval('`' + contentStr + '`');
                    };
                } else {
                    opt.cmp.cfg.template = function () {
                        contentTpl = toLiteralString(contentTpl);
                        return eval('`' + contentTpl + '`');
                    };
                }
            }
        }
    }, {
        key: '_initRawProps',
        value: function _initRawProps(opt) {
            if (!this._isSubclass) {
                this._rawProps = extend.copy(opt.props, typeof opt.cmp.cfg.props === 'function' ? opt.cmp.cfg.props() : opt.cmp.cfg.props);

                this._initTemplate(opt);
            } else {
                this._rawProps = Object.assign({}, opt.props);
            }
        }
    }, {
        key: 'props',
        set: function set(props) {
            this._rawProps = Object.assign({}, props, this._opt.props);
            observer.create(this);
            store.sync(this);
        },
        get: function get() {
            return this._props;
        }
    }, {
        key: 'config',
        set: function set(obj) {
            if (!this._isSubclass) throw new Error('Config is allowed only for classes');

            if (this._configured) throw new Error('Already configured');

            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') throw new TypeError('Config must be an object');

            if (_typeof(obj.mixin) === 'object') {
                this.mixin = obj.mixin;
                localMixin(this);
            }

            if (_typeof(obj.components) === 'object') {
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

            if (_typeof(obj.style) === 'object') {
                this.style = obj.style;
                style.scoped(this);
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
    }]);

    return Component;
}();

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
        _isCreated: {
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
            enumerable: true
        },
        appRoot: {
            value: opt.app._root,
            enumerable: true
        },
        action: {
            value: opt.app.action,
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
        }
    });
}

function drawDynamic(instance) {
    clearDynamic(instance);

    var index = instance._processing.length - 1;

    while (index >= 0) {
        var item = instance._processing[index];
        var root = item.node.parentNode;

        if (item.node[INSTANCE]) {
            item.node[INSTANCE].destroy(true);
        }

        if (item.node.innerHTML === '') {

            var dynamicInstance = __webpack_require__(5).get({
                root: root,
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
    var index = instance._dynamicChildren.length - 1;

    while (index >= 0) {
        var item = instance._dynamicChildren[index];

        if (!document.body.contains(item) && item[INSTANCE]) {
            item[INSTANCE].destroy(true);
            instance._dynamicChildren.splice(index, 1);
        }
        index -= 1;
    }
}

module.exports = {
    Component: Component,
    defineProperties: defineProperties,
    clearDynamic: clearDynamic,
    drawDynamic: drawDynamic
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copies deep missing properties to the target object
 * @param targetObj {Object} target object
 * @param defaultObj {Object} default object
 * @param exclude {Array} exclude properties from copy
 * @returns {*}
 */

function extend(targetObj, defaultObj) {
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    for (var i in defaultObj) {
        /* istanbul ignore else  */
        if (Object.prototype.hasOwnProperty.call(defaultObj, i) && exclude.indexOf(i) === -1) {
            if (!Object.prototype.hasOwnProperty.call(targetObj, i) || typeof targetObj[i] === 'undefined') {
                targetObj[i] = defaultObj[i];
            } else if (_typeof(targetObj[i]) === 'object') {
                extend(targetObj[i], defaultObj[i]);
            }
        }
    }
    return targetObj;
}

/**
 * Creates new target object and copies deep missing properties to the target object
 * @param args[0]] {Object} target object
 * @param args[1]] {Object} default object
 * @param args[2]] {Array} exclude properties from copy
 * @returns {*}
 */
function copy() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    args[0] = Object.assign({}, args[0]);
    return extend.apply(this, args);
}

module.exports = extend;
module.exports.copy = copy;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var html = __webpack_require__(6);

var _require = __webpack_require__(0),
    CMP_INSTANCE = _require.CMP_INSTANCE;

var collection = __webpack_require__(1);
var hooks = __webpack_require__(2);

var _require2 = __webpack_require__(7),
    serializeProps = _require2.serializeProps;

var _require3 = __webpack_require__(24),
    extract = _require3.extract;

var hmr = __webpack_require__(25);

var _require4 = __webpack_require__(3),
    Component = _require4.Component;

function get() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    if (!cfg.root) return;

    cfg.template = typeof cfg.template === 'string' ? html.create(cfg.template) : cfg.template;

    cfg.root.appendChild(cfg.template);

    var component = null;
    var parentElement = void 0;
    var trash = [];

    function walk(child) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        while (child) {

            var cmpName = child.nodeName.toLowerCase();
            var localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            var cmp = cfg.autoCmp || localComponents[cmpName] || cfg.app._components[cmpName] || collection.getComponent(child.nodeName);

            if (cmp) {

                if (parent.cmp) {
                    var rawChild = child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push(child);
                    child = child.nextSibling;
                    continue;
                }

                var props = serializeProps(child);
                var dProps = extract(props);

                var newElement = void 0;

                if (typeof cmp.cfg === 'function') {
                    newElement = new cmp.cfg({
                        tag: cmpName,
                        root: child,
                        app: cfg.app,
                        props: props,
                        dProps: dProps,
                        parentCmp: parent.cmp
                    });
                } else {
                    newElement = new Component({
                        tag: cmpName,
                        cmp: cmp,
                        root: child,
                        app: cfg.app,
                        props: props,
                        dProps: dProps,
                        parentCmp: parent.cmp
                    });
                }

                if (!newElement) {
                    child = child.nextSibling;
                    continue;
                }

                if (_typeof(newElement.module) === 'object') {
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
                    var n = Object.keys(parent.cmp.children).length;
                    parent.cmp.children[newElement.alias ? newElement.alias : n++] = newElement;
                }

                cfg.autoCmp = null;
            }

            if (child.hasChildNodes()) {
                walk(child.firstChild, { cmp: parentElement });
            }

            child = child.nextSibling;
        }
    }

    walk(cfg.template);

    trash.forEach(function (child) {
        return child.remove();
    });

    return component;
}

module.exports = {
    get: get
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexN = /\n/g;
var regexS = /\s+/g;
var replace = ' ';

var html = {
    /**
     * Create DOM element
     * @param str html string
     * @param wrapper tag string
     * @returns {Element | Node | null}
     */
    create: function create(str, wrapper) {
        var element = void 0;
        str = str.replace(regexN, replace);
        str = str.replace(regexS, replace);

        var template = document.createElement('div');
        template.innerHTML = str;

        if (wrapper && template.childNodes.length > 1) {
            element = document.createElement(wrapper);
            element.innerHTML = template.innerHTML;
        } else {
            element = template.firstChild || document.createTextNode('');
        }

        if (!this.isValidNode(element)) throw new Error('Element not valid');
        return element;
    },

    /**
     * Check if is a valid Node
     * @param {*} el
     * @returns {Boolean}
     */
    isValidNode: function isValidNode(el) {
        return el && 'nodeType' in el;
    },

    getAllNodes: function getAllNodes(el) {

        var nodes = [];

        function scanner(n) {
            while (n) {
                nodes.push(n);
                if (n.hasChildNodes()) {
                    scanner(n.firstChild);
                }
                n = n.nextSibling;
            }
        }

        scanner(el);

        return nodes;
    }
};

module.exports = html;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var castStringTo = __webpack_require__(8);
var dashToCamel = __webpack_require__(9);

var _require = __webpack_require__(0),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR,
    TAG = _require.TAG;

function serializeProps(node) {
    var props = {};
    if (node.attributes) {
        var attributes = Array.from(node.attributes);
        for (var j = attributes.length - 1; j >= 0; --j) {
            var attr = attributes[j];
            var isComponentListener = attr.name.match(REGEX.IS_COMPONENT_LISTENER);
            if (isComponentListener) {
                if (props[ATTR.LISTENER] === undefined) props[ATTR.LISTENER] = {};
                props[ATTR.LISTENER][isComponentListener[1]] = attr.nodeValue;
                delete props[attr.name];
            } else {
                var value = attr.nodeValue;
                if (REGEX.IS_STRING_QUOTED.test(value)) value = attr.nodeValue.replace(/"/g, '&quot;');
                props[REGEX.IS_CUSTOM_TAG.test(node.nodeName) ? dashToCamel(attr.name) : attr.name] = attr.name === ATTR.FORCE_UPDATE ? true : castStringTo(value);
            }
        }
    }
    return props;
}

function transform(node) {

    var root = {};

    function walking(node, parent) {
        while (node) {
            var obj = void 0;

            if (node.nodeType === 3) {
                obj = node.nodeValue;
            } else if (node.nodeName.toLowerCase() === TAG.TEXT_NODE_PLACE) {
                obj = node.innerText;
            } else {
                obj = {};
                obj.type = node.nodeName;
                obj.children = [];
                obj.props = serializeProps(node);
                obj.isSVG = typeof node.ownerSVGElement !== 'undefined';
            }

            if (!Object.keys(root).length) root = obj;

            if (parent && parent.children) {
                parent.children.push(obj);
            }

            if (node.hasChildNodes()) {
                walking(node.firstChild, obj);
            }

            node = node.nextSibling;
        }
    }

    walking(node, root);

    return root;
}

module.exports = {
    transform: transform,
    serializeProps: serializeProps
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function castStringTo(obj) {

    if (typeof obj !== 'string') {
        return obj;
    }

    switch (obj) {
        case 'undefined':
            return undefined;
        case 'null':
            return null;
        case 'NaN':
            return NaN;
        case 'Infinity':
            return Infinity;
        case 'true':
            return true;
        case 'false':
            return false;
        case '0':
            return 0; //obj;
        default:
            try {
                return JSON.parse(obj);
            } catch (e) {}
            break;
    }

    var num = parseFloat(obj);
    if (!isNaN(num) && isFinite(obj)) {
        if (obj.toLowerCase().indexOf('0x') === 0) {
            return parseInt(obj, 16);
        }
        return num;
    }

    return obj;
}

module.exports = castStringTo;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function dashToCamel(s) {
    return s.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

module.exports = dashToCamel;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * 	Originally was Observable Slim
 *	Version 0.0.4
 * 	https://github.com/elliotnb/observable-slim
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	Observable Slim is a singleton that allows you to observe changes made to an object and any nested
 *	children of that object. It is intended to assist with one-way data binding, that is, in MVC parlance,
 *	reflecting changes in the model to the app. Observable Slim aspires to be as lightweight and easily
 *	understood as possible. Minifies down to roughly 3000 characters.
 */

function sanitize(str) {
    return typeof str === 'string' ? str.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : str;
}

/**
 * ObservableSlim
 * @type {{create, observe, pause, resume, remove, beforeChange}}
 */
var ObservableSlim = function () {
    // An array that stores all of the observables created through the public create() method below.
    var observables = [];
    // An array of all the objects that we have assigned Proxies to
    var targets = [];

    // An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
    // 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object
    var targetsProxy = [];

    // this variable tracks duplicate proxies assigned to the same target.
    // the 'set' handler below will trigger the same change on all other Proxies tracking the same target.
    // however, in order to avoid an infinite loop of Proxies triggering and re-triggering one another, we use dupProxy
    // to track that a given Proxy was modified from the 'set' handler
    var dupProxy = null;

    var _getProperty = function _getProperty(obj, path) {
        return path.split('.').reduce(function (prev, curr) {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    };

    /**
     * _create
     * @description Private internal function that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
     * @param target {Object} required, plain JavaScript object that we want to observe for changes.
     * @param domDelay {Boolean|Null} batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
     * @param originalObservable {Object} the original observable created by the user, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
     * @param originalPath {String} the path of the property in relation to the target on the original observable, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
     * @returns {Object}
     * @private
     */
    var _create = function _create(target, domDelay, originalObservable, originalPath) {

        var autoDomDelay = domDelay == null;
        var observable = originalObservable || null;
        var path = originalPath || '';

        var changes = [];

        var _getPath = function _getPath(target, property) {
            if (target instanceof Array) {
                return path !== '' ? path : property;
            } else {
                return path !== '' ? path + '.' + property : property;
            }
        };

        var calls = 0;

        var _notifyObservers = function _notifyObservers(numChanges) {

            // if the observable is paused, then we don't want to execute any of the observer functions
            if (observable.paused === true) return;

            // reset calls number after 10ms
            if (autoDomDelay) {
                domDelay = ++calls > 1;
                setTimeout(function () {
                    calls = 0;
                }, 10);
            }

            // execute observer functions on a 10ms settimeout, this prevents the observer functions from being executed
            // separately on every change -- this is necessary because the observer functions will often trigger UI updates
            if (domDelay === true) {
                setTimeout(function () {
                    if (numChanges === changes.length) {
                        // invoke any functions that are observing changes
                        for (var i = 0; i < observable.observers.length; i++) {
                            observable.observers[i](changes);
                        }changes = [];
                    }
                }, 10);
            } else {
                // invoke any functions that are observing changes
                for (var i = 0; i < observable.observers.length; i++) {
                    observable.observers[i](changes);
                }changes = [];
            }
        };

        var handler = {
            get: function get(target, property) {

                // implement a simple check for whether or not the object is a proxy, this helps the .create() method avoid
                // creating Proxies of Proxies.
                if (property === '__getTarget') {
                    return target;
                } else if (property === '__isProxy') {
                    return true;
                    // from the perspective of a given observable on a parent object, return the parent object of the given nested object
                } else if (property === '__getParent') {
                    return function (i) {
                        if (typeof i === 'undefined') i = 1;
                        var parentPath = _getPath(target, '__getParent').split('.');
                        parentPath.splice(-(i + 1), i + 1);
                        return _getProperty(observable.parentProxy, parentPath.join('.'));
                    };
                }

                // for performance improvements, we assign this to a variable so we do not have to lookup the property value again
                var targetProp = target[property];

                // if we are traversing into a new object, then we want to record path to that object and return a new observable.
                // recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
                // the target object and any objects nested within.
                if (targetProp instanceof Object && targetProp !== null && target.hasOwnProperty(property)) {

                    // if we've found a proxy nested on the object, then we want to retrieve the original object behind that proxy
                    if (targetProp.__isProxy === true) targetProp = targetProp.__getTarget;

                    // if we've previously setup a proxy on this target, then...
                    //let a = observable.targets.indexOf(targetProp);
                    var a = -1;
                    var observableTargets = observable.targets;
                    for (var i = 0, l = observableTargets.length; i < l; i++) {
                        if (targetProp === observableTargets[i]) {
                            a = i;
                            break;
                        }
                    }
                    if (a > -1) return observable.proxies[a];

                    // if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
                    // have to create a new proxy for it
                    var newPath = path !== '' ? path + '.' + property : property;

                    return _create(targetProp, domDelay, observable, newPath);
                } else {
                    return observable.renderMode ? sanitize(targetProp) : targetProp;
                }
            },
            deleteProperty: function deleteProperty(target, property) {

                // was this change an original change or was it a change that was re-triggered below
                var originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }

                // in order to report what the previous value was, we must make a copy of it before it is deleted
                var previousValue = Object.assign({}, target);

                // get the path of the property being deleted
                var currentPath = _getPath(target, property);

                // record the deletion that just took place
                changes.push({
                    type: 'delete',
                    target: target,
                    property: property,
                    newValue: null,
                    previousValue: previousValue[property],
                    currentPath: currentPath,
                    proxy: proxy
                });

                if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
                    observable.checkBeforeChange = currentPath;
                    var res = observable.beforeChange(changes);
                    if (res === false) {
                        observable.checkBeforeChange = '';
                        return false;
                    }
                }

                observable.checkBeforeChange = '';

                if (originalChange === true) {
                    var a = void 0,
                        l = void 0;
                    for (a = 0, l = targets.length; a < l; a++) {
                        if (target === targets[a]) break;
                    } // loop over each proxy and see if the target for this change has any other proxies
                    var currentTargetProxy = targetsProxy[a];

                    var b = currentTargetProxy.length;
                    while (b--) {
                        // if the same target has a different proxy
                        if (currentTargetProxy[b].proxy !== proxy) {
                            // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                            // prevent a change on dupProxy from re-triggering the same change on other proxies)
                            dupProxy = currentTargetProxy[b].proxy;

                            // make the same delete on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                            // on any other proxies so that the previousValue can show up correct for the other proxies
                            delete currentTargetProxy[b].proxy[property];
                        }
                    }

                    // perform the delete that we've trapped
                    delete target[property];
                }

                _notifyObservers(changes.length);

                return true;
            },
            set: function set(target, property, value, receiver) {

                // was this change an original change or was it a change that was re-triggered below
                var originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }

                // improve performance by saving direct references to the property
                var targetProp = target[property];

                // only record a change if the new value differs from the old one OR if this proxy was not the original proxy to receive the change
                if (targetProp !== value || originalChange === false) {

                    var typeOfTargetProp = typeof targetProp === 'undefined' ? 'undefined' : _typeof(targetProp);

                    // get the path of the object property being modified
                    var currentPath = _getPath(target, property);

                    // determine if we're adding something new or modifying somethat that already existed
                    var type = 'update';
                    if (typeOfTargetProp === 'undefined') type = 'add';

                    // store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct
                    changes.push({
                        type: type,
                        target: target,
                        property: property,
                        newValue: value,
                        previousValue: receiver[property],
                        currentPath: currentPath,
                        proxy: proxy
                    });

                    if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
                        observable.checkBeforeChange = currentPath;
                        var res = observable.beforeChange(changes);
                        if (res === false) {
                            observable.checkBeforeChange = '';
                            return false;
                        }
                    }

                    observable.checkBeforeChange = '';

                    // !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
                    // if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
                    // observers can be modified of the change that has occurred.
                    if (originalChange === true) {

                        var a = void 0,
                            l = void 0;
                        for (a = 0, l = targets.length; a < l; a++) {
                            if (target === targets[a]) break;
                        } // loop over each proxy and see if the target for this change has any other proxies
                        var currentTargetProxy = targetsProxy[a];
                        if (currentTargetProxy) for (var b = 0, _l = currentTargetProxy.length; b < _l; b++) {
                            // if the same target has a different proxy
                            if (currentTargetProxy[b].proxy !== proxy) {

                                // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                                // prevent a change on dupProxy from re-triggering the same change on other proxies)
                                dupProxy = currentTargetProxy[b].proxy;

                                // invoke the same change on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                                // on any other proxies so that the previousValue can show up correct for the other proxies
                                currentTargetProxy[b].proxy[property] = value;
                            }
                        }

                        // if the property being overwritten is an object, then that means this observable
                        // will need to stop monitoring this object and any nested objects underneath the overwritten object else they'll become
                        // orphaned and grow memory usage. we excute this on a setTimeout so that the clean-up process does not block
                        // the UI rendering -- there's no need to execute the clean up immediately
                        setTimeout(function () {

                            if (typeOfTargetProp === 'object' && targetProp !== null) {

                                // check if the to-be-overwritten target property still exists on the target object
                                // if it does still exist on the object, then we don't want to stop observing it. this resolves
                                // an issue where array .sort() triggers objects to be overwritten, but instead of being overwritten
                                // and discarded, they are shuffled to a new position in the array
                                var keys = Object.keys(target);
                                for (var i = 0, _l2 = keys.length; i < _l2; i++) {
                                    if (target[keys[i]] === targetProp) {
                                        //console.log('target still exists');
                                        return;
                                    }
                                }

                                // loop over each property and recursively invoke the `iterate` function for any
                                // objects nested on targetProp
                                (function iterate(obj) {

                                    var keys = Object.keys(obj);
                                    for (var _i = 0, _l3 = keys.length; _i < _l3; _i++) {
                                        var objProp = obj[keys[_i]];
                                        if (objProp instanceof Object && objProp !== null) iterate(objProp);
                                    }

                                    // if there are any existing target objects (objects that we're already observing)...
                                    //let c = targets.indexOf(obj);
                                    var c = -1;
                                    for (var _i2 = 0, _l4 = targets.length; _i2 < _l4; _i2++) {
                                        if (obj === targets[_i2]) {
                                            c = _i2;
                                            break;
                                        }
                                    }
                                    if (c > -1) {

                                        // ...then we want to determine if the observables for that object match our current observable
                                        var _currentTargetProxy = targetsProxy[c];
                                        var d = _currentTargetProxy.length;

                                        while (d--) {
                                            // if we do have an observable monitoring the object thats about to be overwritten
                                            // then we can remove that observable from the target object
                                            if (observable === _currentTargetProxy[d].observable) {
                                                _currentTargetProxy.splice(d, 1);
                                                break;
                                            }
                                        }

                                        // if there are no more observables assigned to the target object, then we can remove
                                        // the target object altogether. this is necessary to prevent growing memory consumption particularly with large data sets
                                        if (_currentTargetProxy.length === 0) {
                                            targetsProxy.splice(c, 1);
                                            targets.splice(c, 1);
                                        }
                                    }
                                })(targetProp);
                            }
                        }, 10000);

                        // because the value actually differs than the previous value
                        // we need to store the new value on the original target object
                        target[property] = value;

                        // TO DO: the next block of code resolves test case #24, but it results in poor IE11 performance. Find a solution.

                        // if the value we've just set is an object, then we'll need to iterate over it in order to initialize the
                        // observers/proxies on all nested children of the object
                        if (value instanceof Object && value !== null) {
                            (function iterate(proxy) {
                                var target = proxy.__getTarget;
                                var keys = Object.keys(target);
                                for (var i = 0, _l5 = keys.length; i < _l5; i++) {
                                    var _property = keys[i];
                                    if (target[_property] instanceof Object && target[_property] !== null) iterate(proxy[_property]);
                                }
                            })(proxy[property]);
                        }
                    }

                    // notify the observer functions that the target has been modified
                    _notifyObservers(changes.length);
                }
                return true;
            }
        };

        // create the proxy that we'll use to observe any changes
        var proxy = new Proxy(target, handler);

        // we don't want to create a new observable if this function was invoked recursively
        if (observable === null) {
            observable = {
                parentTarget: target,
                domDelay: domDelay,
                parentProxy: proxy,
                observers: [],
                targets: [target],
                proxies: [proxy],
                paused: false,
                path: path
            };
            observables.push(observable);
        } else {
            observable.targets.push(target);
            observable.proxies.push(proxy);
        }

        // store the proxy we've created so it isn't re-created unnecessary via get handler
        var proxyItem = { target: target, proxy: proxy, observable: observable };

        //let targetPosition = targets.indexOf(target);
        var targetPosition = -1;
        for (var i = 0, l = targets.length; i < l; i++) {
            if (target === targets[i]) {
                targetPosition = i;
                break;
            }
        }

        // if we have already created a Proxy for this target object then we add it to the corresponding array
        // on targetsProxy (targets and targetsProxy work together as a Hash table indexed by the actual target object).
        if (targetPosition > -1) {
            targetsProxy[targetPosition].push(proxyItem);
            // else this is a target object that we have not yet created a Proxy for, so we must add it to targets,
            // and push a new array on to targetsProxy containing the new Proxy
        } else {
            targets.push(target);
            targetsProxy.push([proxyItem]);
            targetPosition = targets.length - 1;
        }

        return proxy;
    };

    return {
        /**
         * Create
         * @description Public method that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
         * @param target {Object} required, plain JavaScript object that we want to observe for changes.
         * @param domDelay {Boolean} if true, then batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
         * @param observer {Function} optional, will be invoked when a change is made to the proxy.
         * @returns {Object}
         */
        create: function create(target, domDelay, observer) {

            // test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
            // we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
            if (target.__isProxy === true) {
                target = target.__getTarget;
                //if it is, then we should throw an error. we do not allow creating proxies of proxies
                // because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
                //throw new Error('ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.');
            }

            // fire off the _create() method -- it will create a new observable and proxy and return the proxy
            var proxy = _create(target, domDelay);

            // assign the observer function
            if (typeof observer === 'function') this.observe(proxy, observer);

            // recursively loop over all nested objects on the proxy we've just created
            // this will allow the top observable to observe any changes that occur on a nested object
            (function iterate(proxy) {
                var target = proxy.__getTarget;
                var keys = Object.keys(target);
                for (var i = 0, l = keys.length; i < l; i++) {
                    var property = keys[i];
                    if (target[property] instanceof Object && target[property] !== null) iterate(proxy[property]);
                }
            })(proxy);

            return proxy;
        },

        /**
         * observe
         * @description This method is used to add a new observer function to an existing proxy.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method. We want to observe changes made to this object.
         * @param observer {Function} this function will be invoked when a change is made to the observable (not to be confused with the observer defined in the create() method).
         */
        observe: function observe(proxy, observer) {
            // loop over all the observables created by the _create() function
            var i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].observers.push(observer);
                    break;
                }
            }
        },

        /**
         * Pause
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method
         */
        pause: function pause(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = true;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('DOZ could not pause observable -- matching proxy not found.');
        },

        /**
         * Resume
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method
         */
        resume: function resume(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = false;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('DOZ could not resume observable -- matching proxy not found.');
        },

        /**
         * Remove
         * @description this method will remove the observable and proxy thereby preventing any further callback observers for changes occuring to the target object.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method
         */
        remove: function remove(proxy) {

            var matchedObservable = null;
            var foundMatch = false;

            var c = observables.length;
            while (c--) {
                if (observables[c].parentProxy === proxy) {
                    matchedObservable = observables[c];
                    foundMatch = true;
                    break;
                }
            }
            var a = targetsProxy.length;
            while (a--) {
                var b = targetsProxy[a].length;
                while (b--) {
                    if (targetsProxy[a][b].observable === matchedObservable) {
                        targetsProxy[a].splice(b, 1);
                        if (targetsProxy[a].length === 0) {
                            targetsProxy.splice(a, 1);
                            targets.splice(a, 1);
                        }
                    }
                }
            }
            if (foundMatch === true) {
                observables.splice(c, 1);
            }
        },

        /**
         * beforeChange
         * @description This method accepts a function will be invoked before changes.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        beforeChange: function beforeChange(proxy, callback) {
            if (typeof callback !== 'function') throw new Error('Callback function is required');

            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].beforeChange = callback;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('DOZ -- matching proxy not found.');
        },

        /**
         * beginRender
         * @description This method set renderMode to true so the param in get is sanitized.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        beginRender: function beginRender(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = true;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('DOZ -- matching proxy not found.');
        },

        /**
         * endRender
         * @description This method set renderMode to false.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        endRender: function endRender(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = false;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('DOZ -- matching proxy not found.');
        }
    };
}();

module.exports = ObservableSlim;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function delay(cb) {
    if (window.requestAnimationFrame !== undefined) return window.requestAnimationFrame(cb);else return window.setTimeout(cb);
}

module.exports = delay;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function camelToDash(s) {
    return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

module.exports = camelToDash;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var camelToDash = __webpack_require__(12);

function toInlineStyle(obj) {
    var withStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    obj = Object.entries(obj).reduce(function (styleString, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            propName = _ref2[0],
            propValue = _ref2[1];

        return '' + styleString + camelToDash(propName) + ':' + propValue + ';';
    }, '');
    return withStyle ? 'style="' + obj + '"' : obj;
}

module.exports = toInlineStyle;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function toLiteralString(str) {
    return str.replace(/{{/gm, '${').replace(/}}/gm, '}');
}

module.exports = toLiteralString;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    TAG = _require.TAG;

var tag = TAG.TEXT_NODE_PLACE;
var LESS = '<';
var GREATER = '>';

var regOpen = new RegExp('<' + tag + '>(\\s+)?<', 'gi');
var regClose = new RegExp('>(\\s+)?</' + tag + '>', 'gi');

/**
 * This method add special tag to value placeholder
 * @param strings
 * @param value
 * @returns {*}
 */
module.exports = function (strings) {
    var result = strings[0];
    var allowTag = false;

    for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        value[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < value.length; ++i) {
        [].concat(_toConsumableArray(strings[i])).forEach(function (char) {
            if (char === LESS) allowTag = false;
            if (char === GREATER) allowTag = true;
        });

        if (allowTag) result += '<' + tag + '>' + value[i] + '</' + tag + '>' + strings[i + 1];else result += '' + value[i] + strings[i + 1];
    }

    result = result.replace(regOpen, LESS).replace(regClose, GREATER);

    return result;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function mixin(target) {
    var sources = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || target == null) {
        throw new TypeError('expected an object');
    }

    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    for (var j = sources.length - 1; j >= 0; --j) {
        var keys = Object.keys(sources[j]);
        for (var i = keys.length - 1; i >= 0; --i) {
            var index = keys[i];
            if (typeof target[index] === 'undefined') {
                target[index] = sources[j][index];
            }
        }
    }

    return target;
}

module.exports = mixin;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    registerPlugin = _require.registerPlugin,
    data = _require.data;

function use(plugin) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }

    plugin['options'] = options;

    registerPlugin(plugin);
}

function load(app) {
    data.plugins.forEach(function (func) {
        func(app.constructor, app, func.options);
    });
}

module.exports = {
    use: use,
    load: load
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(19);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Doz = __webpack_require__(20);
var collection = __webpack_require__(1);
var component = __webpack_require__(41);

var _require = __webpack_require__(17),
    use = _require.use;

var _require2 = __webpack_require__(3),
    Component = _require2.Component;

var h = __webpack_require__(15);
var mixin = __webpack_require__(42);
var compile = __webpack_require__(43);

Object.defineProperties(Doz, {
    collection: {
        value: collection,
        enumerable: true
    },
    compile: {
        value: compile,
        enumerable: true
    },
    Component: {
        value: Component,
        enumerable: true
    },
    component: {
        value: component,
        enumerable: true
    },
    define: {
        value: component,
        enumerable: true
    },
    h: {
        value: h,
        enumerable: true
    },
    mixin: {
        value: mixin,
        enumerable: true
    },
    use: {
        value: use,
        enumerable: true
    },
    version: {
        value: '1.5.0',
        enumerable: true
    }
});

module.exports = Doz;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = __webpack_require__(4);
var bind = __webpack_require__(21);
var instances = __webpack_require__(5);

var _require = __webpack_require__(0),
    TAG = _require.TAG,
    REGEX = _require.REGEX;

var toLiteralString = __webpack_require__(14);
var plugin = __webpack_require__(17);

var Doz = function () {
    function Doz() {
        var _this = this;

        var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Doz);

        this.baseTemplate = '<' + TAG.APP + '></' + TAG.APP + '>';

        if (REGEX.IS_ID_SELECTOR.test(cfg.root)) {
            cfg.root = document.getElementById(cfg.root.substring(1));
        }

        if (REGEX.IS_ID_SELECTOR.test(cfg.template)) {
            cfg.template = document.getElementById(cfg.template.substring(1));
            cfg.template = cfg.template.innerHTML;
        }

        if (!(cfg.root instanceof HTMLElement)) {
            throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
        }

        if (!(cfg.template instanceof HTMLElement || typeof cfg.template === 'string' || typeof cfg.template === 'function')) {
            throw new TypeError('template must be a string or an HTMLElement or a function or an valid ID selector like #example-template');
        }

        // Remove if already exists
        var appNode = document.querySelector(TAG.APP);
        if (appNode) {
            appNode.parentNode.removeChild(appNode);
        }

        this.cfg = extend(cfg, {
            components: [],
            actions: {},
            autoDraw: true
        });

        Object.defineProperties(this, {
            _components: {
                value: {},
                writable: true
            },
            _usedComponents: {
                value: {},
                writable: true
            },
            _stores: {
                value: {},
                writable: true
            },
            _cache: {
                value: new Map()
            },
            _ids: {
                value: {},
                writable: true
            },
            _onAppReadyCB: {
                value: [],
                writable: true
            },
            _callAppReady: {
                value: function value() {
                    this._onAppReadyCB.forEach(function (cb) {
                        if (typeof cb === 'function' && cb._instance) {
                            cb.call(cb._instance);
                        }
                    });

                    this._onAppReadyCB = [];
                }
            },
            _onAppDrawCB: {
                value: [],
                writable: true
            },
            _onAppCB: {
                value: {},
                writable: true
            },
            _root: {
                value: this.cfg.root
            },
            action: {
                value: bind(this.cfg.actions, this),
                enumerable: true
            },
            mount: {
                value: function value(template, root) {
                    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._tree;


                    if (typeof root === 'string') {
                        root = document.querySelector(root);
                    }

                    root = root || parent._rootElement;

                    if (!(root instanceof HTMLElement)) {
                        throw new TypeError('root must be an HTMLElement or an valid selector like #example-root');
                    }

                    var contentStr = eval('`' + toLiteralString(template) + '`');
                    var autoCmp = {
                        tag: TAG.MOUNT,
                        cfg: {
                            props: {},
                            template: function template() {
                                return '<' + TAG.ROOT + '>' + contentStr + '</' + TAG.ROOT + '>';
                            }
                        }
                    };

                    return instances.get({
                        root: root,
                        template: '<' + TAG.MOUNT + '></' + TAG.MOUNT + '>',
                        app: this,
                        parentCmp: parent,
                        autoCmp: autoCmp,
                        mount: true
                    });
                },
                enumerable: true
            }
        });

        if (Array.isArray(this.cfg.components)) {
            this.cfg.components.forEach(function (cmp) {
                if ((typeof cmp === 'undefined' ? 'undefined' : _typeof(cmp)) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
                    _this._components[cmp.tag] = cmp;
                }
            });
        } else if (_typeof(this.cfg.components) === 'object') {
            Object.keys(this.cfg.components).forEach(function (objName) {
                _this._components[objName] = {
                    tag: objName,
                    cfg: _this.cfg.components[objName]
                };
            });
        }

        this._components[TAG.APP] = {
            tag: TAG.APP,
            cfg: {
                template: typeof cfg.template === 'function' ? cfg.template : function () {
                    var contentStr = toLiteralString(cfg.template);
                    return eval('`' + contentStr + '`');
                }
            }
        };

        Object.keys(cfg).forEach(function (p) {
            if (!['template', 'root'].includes(p)) _this._components[TAG.APP].cfg[p] = cfg[p];
        });

        plugin.load(this);

        if (this.cfg.autoDraw) this.draw();

        this._callAppReady();
        this.emit('ready', this);
    }

    _createClass(Doz, [{
        key: 'draw',
        value: function draw() {

            if (!this.cfg.autoDraw) this.cfg.root.innerHTML = '';

            this._tree = instances.get({
                root: this.cfg.root,
                template: this.baseTemplate,
                app: this
            }) || [];

            return this;
        }
    }, {
        key: 'getComponent',
        value: function getComponent(alias) {
            return this._tree ? this._tree.children[alias] : undefined;
        }
    }, {
        key: 'getComponentById',
        value: function getComponentById(id) {
            return this._ids[id];
        }
    }, {
        key: 'getStore',
        value: function getStore(store) {
            return this._stores[store];
        }
    }, {
        key: 'on',
        value: function on(event, callback) {
            if (typeof event !== 'string') throw new TypeError('Event must be a string');

            if (typeof callback !== 'function') throw new TypeError('Callback must be a function');

            if (!this._onAppCB[event]) {
                this._onAppCB[event] = [];
            }

            this._onAppCB[event].push(callback);

            return this;
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _this2 = this;

            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            if (this._onAppCB[event]) {
                this._onAppCB[event].forEach(function (func) {
                    func.apply(_this2, params);
                });
            }

            return this;
        }
    }]);

    return Doz;
}();

module.exports = Doz;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function bind(obj, context) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj == null) {
        throw new TypeError('expected an object');
    }

    var target = Object.assign({}, obj);

    var keys = Object.keys(obj);

    for (var i = keys.length - 1; i >= 0; --i) {
        var item = target[keys[i]];
        if (typeof item === 'function') {
            target[keys[i]] = item.bind(context);
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item != null) {
            target[keys[i]] = bind(item, context);
        }
    }

    return target;
}

module.exports = bind;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    components: {},
    plugins: []
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _list = [];

/**
 * Simple deprecate
 * @param prop {*}
 * @param msg {string}
 * @returns {boolean}
 */
var deprecate = function deprecate(prop, msg) {
    if (typeof prop !== 'undefined') {
        msg = msg || prop;

        if (!_list.includes(msg)) _list.push(msg);

        console.warn('[' + deprecate.title + ']', msg);
        return true;
    }
    return false;
};

deprecate.title = 'DeprecationWarning';

/**
 * Calls only once same deprecation
 * @param args
 * @returns {boolean}
 */
var once = function once() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (_list.includes(args[1] || args[0])) return false;
    return deprecate.apply(undefined, args);
};

module.exports = deprecate;
module.exports.once = once;
module.exports._list = _list;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    ATTR = _require.ATTR;

function extract(props) {

    var dProps = {};

    if (props[ATTR.ALIAS] !== undefined) {
        dProps['alias'] = props[ATTR.ALIAS];
        delete props[ATTR.ALIAS];
    }

    if (props[ATTR.STORE] !== undefined) {
        dProps['store'] = props[ATTR.STORE];
        delete props[ATTR.STORE];
    }

    if (props[ATTR.LISTENER] !== undefined) {
        dProps['callback'] = props[ATTR.LISTENER];
        delete props[ATTR.LISTENER];
    }

    if (props[ATTR.ID] !== undefined) {
        dProps['id'] = props[ATTR.ID];
        delete props[ATTR.ID];
    }

    return dProps;
}

module.exports = {
    extract: extract
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function hmr(instance, _module) {
    if (!_module || !_module.hot) return;
    var NS_PROPS = '__doz_hmr_props_store__';
    var NS_INIT_PROPS = '__doz_hmr_init_props_store__';

    window[NS_PROPS] = window[NS_PROPS] || {};
    window[NS_INIT_PROPS] = window[NS_INIT_PROPS] || {};
    var id = _module.id;
    window[NS_PROPS][id] = window[NS_PROPS][id] || new Map();
    window[NS_INIT_PROPS][id] = window[NS_INIT_PROPS][id] || new Map();

    Object.keys(instance.props).forEach(function (p) {
        if (instance._initialProps[p] === window[NS_INIT_PROPS][id].get(p)) instance.props[p] = window[NS_PROPS][id].get(p) || instance.props[p];else instance.props[p] = instance._initialProps[p];
    });

    _module.hot.dispose(function () {
        Object.keys(instance.props).forEach(function (p) {
            window[NS_PROPS][id].set(p, instance.props[p]);
            window[NS_INIT_PROPS][id].set(p, instance._initialProps[p]);
        });
    });
}

module.exports = hmr;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var proxy = __webpack_require__(10);
var events = __webpack_require__(2);
var delay = __webpack_require__(11);

function updateBound(instance, changes) {
    changes.forEach(function (item) {
        if (Object.prototype.hasOwnProperty.call(instance._boundElements, item.property)) {
            instance._boundElements[item.property].forEach(function (element) {
                if (element.type === 'checkbox') {
                    if (!element.defaultValue) element.checked = item.newValue;else if (Array.isArray(item.newValue)) {
                        var inputs = document.querySelectorAll('input[name=' + element.name + '][type=checkbox]');
                        [].concat(_toConsumableArray(inputs)).forEach(function (input) {
                            return input.checked = item.newValue.includes(input.value);
                        });
                    }
                } else if (element.type === 'radio') {
                    element.checked = element.value === item.newValue;
                } else if (element.type === 'select-multiple' && Array.isArray(item.newValue)) {
                    [].concat(_toConsumableArray(element.options)).forEach(function (option) {
                        return option.selected = item.newValue.includes(option.value);
                    });
                } else {
                    element.value = item.newValue;
                }
            });
        }
    });
}

function create(instance) {

    if (instance._props.__isProxy) proxy.remove(instance._props);

    instance._props = proxy.create(instance._rawProps, null, function (changes) {
        instance.render();
        updateBound(instance, changes);
        if (instance._isCreated) {
            delay(function () {
                events.callUpdate(instance, changes);
            });
        }
    });

    proxy.beforeChange(instance._props, function (changes) {
        var res = events.callBeforeUpdate(instance, changes);
        if (res === false) return false;
    });
}

module.exports = {
    create: create
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var element = __webpack_require__(28);

module.exports = {
    updateElement: element.update
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(29),
    attach = _require.attach,
    updateAttributes = _require.updateAttributes;

var deadChildren = [];

var _require2 = __webpack_require__(0),
    INSTANCE = _require2.INSTANCE,
    TAG = _require2.TAG,
    NS = _require2.NS,
    CMP_INSTANCE = _require2.CMP_INSTANCE;

function isChanged(nodeA, nodeB) {
    return (typeof nodeA === 'undefined' ? 'undefined' : _typeof(nodeA)) !== (typeof nodeB === 'undefined' ? 'undefined' : _typeof(nodeB)) || typeof nodeA === 'string' && nodeA !== nodeB || nodeA.type !== nodeB.type || nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial) {
    if (typeof node === 'undefined') return;

    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    if (node.type[0] === '#') {
        node.type = TAG.EMPTY;
    }

    var $el = node.isSVG ? document.createElementNS(NS.SVG, node.type) : document.createElement(node.type);

    attach($el, node.props, cmp);

    node.children.map(function (item) {
        return create(item, cmp, initial);
    }).forEach($el.appendChild.bind($el));

    if (node.type.indexOf('-') !== -1 && !initial) {
        //console.log('ADD TO DYNAMIC', $el)
        cmp._processing.push({ node: $el, action: 'create' });
    }

    return $el;
}

function update($parent, newNode, oldNode) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var cmp = arguments[4];
    var initial = arguments[5];


    if (!$parent) return;

    if (!oldNode) {
        var rootElement = create(newNode, cmp, initial);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    } else if (isChanged(newNode, oldNode)) {
        var newElement = create(newNode, cmp, initial);
        var oldElement = $parent.childNodes[index];

        //Re-assign CMP INSTANCE to new element
        if (oldElement[CMP_INSTANCE]) {
            newElement[CMP_INSTANCE] = oldElement[CMP_INSTANCE];
            newElement[CMP_INSTANCE]._rootElement = newElement;
        }

        $parent.replaceChild(newElement, oldElement);
        return newElement;
    } else if (newNode.type) {
        var updated = updateAttributes($parent.childNodes[index], newNode.props, oldNode.props, cmp);

        if ($parent.childNodes[index]) {
            var dynInstance = $parent.childNodes[index][INSTANCE];
            if (dynInstance && updated.length) {
                updated.forEach(function (props) {
                    Object.keys(props).forEach(function (name) {
                        dynInstance.props[name] = props[name];
                    });
                });

                return;
            }
        }

        var newLength = newNode.children.length;
        var oldLength = oldNode.children.length;

        for (var i = 0; i < newLength || i < oldLength; i++) {
            update($parent.childNodes[index], newNode.children[i], oldNode.children[i], i, cmp, initial);
        }

        clearDead();
    }
}

function clearDead() {
    var dl = deadChildren.length;

    while (dl--) {
        deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create: create,
    update: update
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR,
    CMP_INSTANCE = _require.CMP_INSTANCE;

var castStringTo = __webpack_require__(8);
var dashToCamel = __webpack_require__(9);
var camelToDash = __webpack_require__(12);
var objectPath = __webpack_require__(30);
var delay = __webpack_require__(11);

function isEventAttribute(name) {
    return REGEX.IS_LISTENER.test(name);
}

function isBindAttribute(name) {
    return name === ATTR.BIND;
}

function isRefAttribute(name) {
    return name === ATTR.REF;
}

function canBind($target) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1;
}

function setAttribute($target, name, value, cmp) {
    if (REGEX.IS_CUSTOM_TAG.test($target.nodeName)) name = camelToDash(name);
    if (isCustomAttribute(name)) {} else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        try {
            $target.setAttribute(name, JSON.stringify(value));
        } catch (e) {}
    } else {
        $target.setAttribute(name, value);
    }
}

function removeAttribute($target, name, value) {
    if (isCustomAttribute(name) || !$target) {} else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal, cmp) {
    if (newVal === '') {
        removeAttribute($target, name, oldVal, cmp);
        updateChildren(cmp, name, newVal, $target);
    } else if (oldVal === '' || newVal !== oldVal) {
        setAttribute($target, name, newVal, cmp);
        updateChildren(cmp, name, newVal, $target);
    }
}

function updateChildren(cmp, name, value, $target) {
    if (cmp && cmp.updateChildrenProps && $target) {
        name = dashToCamel(name);
        var firstChild = $target.firstChild;
        if (firstChild && firstChild[CMP_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild[CMP_INSTANCE]._publicProps, name)) firstChild[CMP_INSTANCE].props[name] = value;
    }
}

function updateAttributes($target, newProps) {
    var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cmp = arguments[3];

    var props = Object.assign({}, newProps, oldProps);
    var updated = [];
    Object.keys(props).forEach(function (name) {
        updateAttribute($target, name, newProps[name], oldProps[name], cmp);
        if (newProps[name] !== oldProps[name]) {
            var obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    });

    return updated;
}

function isCustomAttribute(name) {
    return isEventAttribute(name) || isBindAttribute(name) || isRefAttribute(name) || name === ATTR.FORCE_UPDATE;
}

function setBooleanAttribute($target, name, value) {
    if (!$target) return;
    $target.setAttribute(name, value);
    $target[name] = value;
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function trimQuotes(str) {
    return str.replace(REGEX.TRIM_QUOTES, '$1');
}

function addEventListener($target, name, value, cmp) {

    if (!isEventAttribute(name)) return;

    var match = value.match(REGEX.GET_LISTENER);

    if (match) {
        var args = null;
        var handler = match[1];
        var stringArgs = match[2];
        if (stringArgs) {
            args = stringArgs.split(',').map(function (item) {
                item = item.trim();
                return item === 'this' ? cmp : castStringTo(trimQuotes(item));
            });
        }

        var isParentMethod = handler.match(REGEX.IS_PARENT_METHOD);

        if (isParentMethod) {
            handler = isParentMethod[1];
            cmp = cmp.parent;
        }

        var method = objectPath(handler, cmp);

        if (method !== undefined) {
            value = args ? method.bind.apply(method, [cmp].concat(_toConsumableArray(args))) : method.bind(cmp);
        }
    }

    if (typeof value === 'function') $target.addEventListener(extractEventName(name), value);else {
        value = value.replace(REGEX.THIS_TARGET, '$target');

        var _func = function _func() {
            eval(value);
        };
        $target.addEventListener(extractEventName(name), _func.bind(cmp));
    }
}

function setBind($target, name, value, cmp) {
    if (!isBindAttribute(name) || !canBind($target)) return;
    if (typeof cmp.props[value] !== 'undefined') {

        var events = ['compositionstart', 'compositionend', 'input', 'change'];

        events.forEach(function (event) {
            $target.addEventListener(event, function (e) {
                var _value = void 0;
                if (this.type === 'checkbox') {
                    if (!this.defaultValue) cmp.props[value] = this.checked;else {
                        var inputs = document.querySelectorAll('input[name=' + this.name + '][type=checkbox]:checked');
                        _value = [].concat(_toConsumableArray(inputs)).map(function (input) {
                            return input.value;
                        });
                        cmp.props[value] = _value;
                    }
                } else {
                    _value = this.value;
                    if (this.multiple) {
                        _value = [].concat(_toConsumableArray(this.options)).filter(function (option) {
                            return option.selected;
                        }).map(function (option) {
                            return option.value;
                        });
                    }
                    cmp.props[value] = _value;
                }
            });
        });

        if (Object.prototype.hasOwnProperty.call(cmp._boundElements, value)) {
            cmp._boundElements[value].push($target);
        } else {
            cmp._boundElements[value] = [$target];
        }

        return true;
    }
}

function setRef($target, name, value, cmp) {
    if (!isRefAttribute(name)) return;
    cmp.ref[value] = $target;
}

function attach($target, props, cmp) {
    var bindValue = void 0;

    Object.keys(props).forEach(function (name) {
        setAttribute($target, name, props[name], cmp);
        addEventListener($target, name, props[name], cmp);
        if (setBind($target, name, props[name], cmp)) {
            bindValue = cmp.props[props[name]];
        }
        setRef($target, name, props[name], cmp);
    });

    for (var i in $target.dataset) {
        if (Object.prototype.hasOwnProperty.call($target.dataset, i) && REGEX.IS_LISTENER.test(i)) {
            addEventListener($target, i, $target.dataset[i], cmp);
        }
    }

    if (typeof bindValue !== 'undefined') {
        delay(function () {
            var inputs = void 0;
            if ($target.type === 'radio') {
                inputs = document.querySelectorAll('input[name=' + $target.name + '][type=radio]');
                inputs.forEach(function (input) {
                    return input.checked = bindValue === input.value;
                });
            } else if ($target.type === 'checkbox') {
                if ((typeof bindValue === 'undefined' ? 'undefined' : _typeof(bindValue)) === 'object') {
                    inputs = document.querySelectorAll('input[name=' + $target.name + '][type=checkbox]');
                    inputs.forEach(function (input) {
                        return input.checked = Array.from(bindValue).includes(input.value);
                    });
                } else $target.checked = bindValue;
            } else {
                $target.value = bindValue;
            }
        });
    }
}

module.exports = {
    attach: attach,
    updateAttributes: updateAttributes
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getByPath(path, obj) {
    return path.split('.').reduce(function (res, prop) {
        return res ? res[prop] : undefined;
    }, obj);
}

function getLast(path, obj) {
    if (path.indexOf('.') !== -1) {
        path = path.split('.');
        path.pop();
        path = path.join('.');
    }
    return getByPath(path, obj);
}

module.exports = getByPath;
module.exports.getLast = getLast;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function create(instance) {
    var storeName = instance.store;
    if (typeof storeName === 'string') {
        if (instance.app._stores[storeName] !== undefined) {
            throw new Error('Store already defined: ' + storeName);
        }
        instance.app._stores[storeName] = instance.props;
    }
}

function sync(instance) {
    var storeName = instance.store;
    if (typeof storeName === 'string' && instance.app._stores[storeName] !== undefined) {
        instance.app._stores[storeName] = instance.props;
    }
}

module.exports = {
    create: create,
    sync: sync
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function create(instance) {

    var id = instance.id;

    if (typeof id === 'string') {
        if (instance.app._ids[id] !== undefined) {
            throw new Error('ID already defined: ' + id);
        }
        instance.app._ids[id] = instance;
    }
}

module.exports = {
    create: create
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var composeStyle = __webpack_require__(34);

function scoped(instance) {
    if (_typeof(instance.style) !== 'object') return;

    var styleId = instance.tag + '--style';
    var styleExists = document.querySelector('#' + styleId);

    if (styleExists) {
        styleExists.innerHTML = composeStyle(instance.style, instance.tag);
    } else {
        var styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = composeStyle(instance.style, instance.tag);
        document.head.appendChild(styleEl);
    }
}

module.exports = {
    scoped: scoped
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInlineStyle = __webpack_require__(13);

function composeStyle(style, tag) {
    var out = '';
    Object.keys(style).forEach(function (key) {
        if (/^@media/.test(key)) {
            out += key + ' {' + composeStyle(style[key], tag) + '}';
        } else {
            var properties = toInlineStyle(style[key], false);
            key = tag + ' ' + key.replace(/(,)/g, '$1' + tag + ' ');
            out += key + '{' + properties + '} ';
        }
    });
    return out;
}

module.exports = composeStyle;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function add(instance) {
    if (typeof instance.onAppReady === 'function') {
        instance.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.onAppReady);
    }
}

module.exports = {
    add: add
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function add(instance) {
    if (typeof instance.onAppDraw === 'function') {
        instance.onAppDraw._instance = instance;
        instance.app._onAppDrawCB.push(instance.onAppDraw);
    }
}

function emit(instance, next, prev) {
    instance.app._onAppDrawCB.forEach(function (cb) {
        if (typeof cb === 'function' && cb._instance) {
            cb.call(cb._instance, next, prev, instance);
        }
    });
}

module.exports = {
    add: add,
    emit: emit
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);
}

module.exports = extendInstance;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = cloneObject;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function loadLocal(instance) {

    // Add local components
    if (Array.isArray(instance.components)) {
        instance.components.forEach(function (cmp) {
            if ((typeof cmp === 'undefined' ? 'undefined' : _typeof(cmp)) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
                instance._components[cmp.tag] = cmp;
            }
        });
        delete instance.components;
    } else if (_typeof(instance.components) === 'object') {
        Object.keys(instance.components).forEach(function (objName) {
            instance._components[objName] = {
                tag: objName,
                cfg: instance.components[objName]
            };
        });
        delete instance.components;
    }
}

module.exports = loadLocal;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mixin = __webpack_require__(16);

function localMixin(instance) {
    mixin(instance, instance.mixin);
    instance.mixin = [];
}

module.exports = localMixin;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    registerComponent = _require.registerComponent;

var _require2 = __webpack_require__(0),
    REGEX = _require2.REGEX;

function component(tag) {
    var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }

    var cmp = {
        tag: tag,
        cfg: cfg
    };

    registerComponent(cmp);
}

module.exports = component;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(3),
    Component = _require.Component;

var mixin = __webpack_require__(16);

function globalMixin(obj) {
    mixin(Component.prototype, obj);
}

module.exports = globalMixin;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html = __webpack_require__(6);

var _require = __webpack_require__(7),
    transform = _require.transform;

var _require2 = __webpack_require__(0),
    TAG = _require2.TAG;

function compile() {
    var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    template = template.trim();
    var tpl = html.create(template, TAG.ROOT);
    return transform(tpl);
}

module.exports = compile;

/***/ })
/******/ ]);
}); 