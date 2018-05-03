// [DOZ]  Build version: 0.0.15  
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    ROOT: '__DOZ_GLOBAL_COMPONENTS__',
    INSTANCE: '__DOZ_INSTANCE__',
    TAG: {
        ROOT: 'doz-root',
        EACH: 'doz-each-root',
        VIEW: 'doz-view',
        SUFFIX_ROOT: '-root'
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
        GET_LISTENER: /^this.(.*)\((.*)\)/,
        TRIM_QUOTES: /^["'](.*)["']$/
        //SET_DYNAMIC: /^(<[\w-]+)(.*)/
    },
    ATTR: {
        // Attributes for HTMLElement
        BIND: 'd-bind',
        REF: 'd-ref',
        // Attributes for Components
        ALIAS: 'd:alias',
        STORE: 'd:store',
        LISTENER: 'd:on',
        ID: 'd:id'
        //DYNAMIC: 'd:dyn'
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    ROOT = _require.ROOT;

/**
 * Get or create global collection
 * @returns {{}|components|{InjectAsComment: boolean, InjectByTag: boolean}|{InjectAsComment, InjectByTag}|Array|*}
 */


function getOrCreate() {
    window[ROOT] = window[ROOT] || { components: {} };
    return window[ROOT].components;
}

/**
 * Register a component to global
 * @param cmp
 */
function register(cmp) {
    var collection = getOrCreate();

    var tag = cmp.tag.toUpperCase();

    if (!collection.hasOwnProperty(tag)) {
        collection[tag] = cmp;
    } else {
        throw new Error('Component ' + tag + ' already defined');
    }
}

function removeAll() {
    if (window[ROOT]) window[ROOT].components = {};
}

/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function get(tag) {
    if (typeof tag !== 'string') throw new TypeError('tag must be a string');

    tag = tag.toUpperCase();

    var collection = getOrCreate();
    return collection[tag];
}

module.exports = {
    register: register,
    get: get,
    removeAll: removeAll
};

/***/ }),
/* 2 */
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
        if (defaultObj.hasOwnProperty(i) && exclude.indexOf(i) === -1) {
            if (!targetObj.hasOwnProperty(i) || typeof targetObj[i] === 'undefined') {
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
 * @param args[0] {Object} target object
 * @param args[1] {Object} default object
 * @param args[2] {Array} exclude properties from copy
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(2);

var _require = __webpack_require__(1),
    register = _require.register;

var html = __webpack_require__(4);

var _require2 = __webpack_require__(0),
    REGEX = _require2.REGEX,
    TAG = _require2.TAG,
    INSTANCE = _require2.INSTANCE;

var collection = __webpack_require__(1);
var observer = __webpack_require__(13);
var events = __webpack_require__(5);

var _require3 = __webpack_require__(6),
    transform = _require3.transform,
    serializeProps = _require3.serializeProps;

var update = __webpack_require__(8).updateElement;
var store = __webpack_require__(18);
var ids = __webpack_require__(19);

var _require4 = __webpack_require__(20),
    extract = _require4.extract;

function component(tag) {
    var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }

    var cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        updateChildrenProps: true,
        props: {},
        template: function template() {
            return '<div></div>';
        }
    });

    register(cmp);
}

function getInstances() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    cfg.template = typeof cfg.template === 'string' ? html.create(cfg.template) : cfg.template;

    if (!cfg.transform) cfg.root.appendChild(cfg.template);

    var component = null;
    var parentElement = void 0;

    function walk(child) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        while (child) {

            var cmp = cfg.autoCmp || collection.get(child.nodeName) || cfg.view._components[child.nodeName.toLowerCase()];

            if (cmp) {

                var props = serializeProps(child);
                var dProps = extract(props);

                var newElement = createInstance(cmp, {
                    root: child,
                    view: cfg.view,
                    props: props,
                    dProps: dProps,
                    parentCmp: parent.cmp,
                    isStatic: cfg.isStatic
                });

                if (!newElement) {
                    continue;
                }

                newElement.render(true);

                if (!component) {
                    component = newElement;
                }

                child.insertBefore(newElement._rootElement, child.firstChild);

                events.callRender(newElement);
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

    return component;
}

function createInstance(cmp, cfg) {
    var props = extend.copy(cfg.props, typeof cmp.cfg.props === 'function' ? cmp.cfg.props() : cmp.cfg.props);

    var instance = Object.defineProperties({}, {
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
        _isStatic: {
            value: cfg.isStatic
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
            value: function value(name) {
                if (this._callback && this._callback[name] !== undefined && this.parent[this._callback[name]] !== undefined && typeof this.parent[this._callback[name]] === 'function') {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    this.parent[this._callback[name]].apply(this.parent, args);
                }
            },
            enumerable: true
        },
        each: {
            value: function value(obj, func) {
                if (Array.isArray(obj)) {
                    return obj.map(func).map(function (stringEl) {
                        stringEl = stringEl.trim();
                        return stringEl;
                    }).join('');
                }
            },
            enumerable: true
        },
        getStore: {
            value: function value(storeName) {
                return this.view.getStore(storeName);
            },
            enumerable: true
        },
        getComponentById: {
            value: function value(id) {
                return this.view.getComponentById(id);
            },
            enumerable: true
        },
        action: {
            value: cfg.view.action,
            enumerable: true
        },
        render: {
            value: function value(initial) {
                var tag = this.tag ? this.tag + TAG.SUFFIX_ROOT : TAG.ROOT;
                var template = this.template().trim();
                var tpl = html.create('<' + tag + '>' + template + '</' + tag + '>');
                var next = transform(tpl);

                var rootElement = update(cfg.root, next, this._prev, 0, this, initial);

                drawDynamic(this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        mount: {
            value: function value(template) {
                var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var root = this._rootElement;
                if (typeof cfg.selector === 'string') root = root.querySelector(cfg.selector);else if (cfg.selector instanceof HTMLElement) root = cfg.selector;
                return this.view.mount(template, root, this);
            },
            enumerable: true
        },
        destroy: {
            value: function value() {
                var _this = this;

                var onlyInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                if (!onlyInstance && (!this._rootElement || events.callBeforeDestroy(this) === false || !this._rootElement.parentNode)) {
                    console.warn('destroy failed');
                    return;
                }

                Object.keys(this.children).forEach(function (child) {
                    _this.children[child].destroy();
                });

                if (!onlyInstance) this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);else this._rootElement.parentNode.innerHTML = '';

                events.callDestroy(this);
            },
            enumerable: true
        }
    });

    // Assign cfg to instance
    extendInstance(instance, cmp.cfg, cfg.dProps);

    var beforeCreate = events.callBeforeCreate(instance);
    if (beforeCreate === false) return undefined;

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

function drawDynamic(instance) {
    clearDynamic(instance);

    var index = instance._processing.length - 1;

    while (index >= 0) {
        var item = instance._processing[index];
        var root = item.node.parentNode;

        if (item.node[INSTANCE]) {
            item.node[INSTANCE].destroy(true);
        }

        var dynamicInstance = getInstances({ root: root, template: item.node.outerHTML, view: instance.view });

        instance._dynamicChildren.push(dynamicInstance._rootElement.parentNode);

        root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
        dynamicInstance._rootElement.parentNode[INSTANCE] = dynamicInstance;
        instance._processing.splice(index, 1);
        index -= 1;
    }
}

module.exports = {
    component: component,
    getInstances: getInstances
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexN = /\n/g;
var regexS = /\s+/g;
var replace = ' ';

var html = {
    /**
     * Create DOM element
     * @param str html string
     * @returns {Element | Node | null}
     */
    create: function create(str) {
        var element = void 0;
        str = str.replace(regexN, replace);
        str = str.replace(regexS, replace);

        var template = document.createElement('div');
        template.innerHTML = str;
        element = template.firstChild;

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

function callRender(context) {
    if (typeof context.onRender === 'function') {
        context.onRender.call(context);
    }
}

function callBeforeUpdate(context) {
    if (typeof context.onBeforeUpdate === 'function') {
        return context.onBeforeUpdate.call(context, Object.assign({}, context.props));
    }
}

function callUpdate(context) {
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context);
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
    callRender: callRender,
    callBeforeUpdate: callBeforeUpdate,
    callUpdate: callUpdate,
    callBeforeDestroy: callBeforeDestroy,
    callDestroy: callDestroy
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var castStringTo = __webpack_require__(7);

var _require = __webpack_require__(0),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR;

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
                props[attr.name] = attr.nodeValue === '' ? true : castStringTo(attr.nodeValue);
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
            } else {
                obj = {};
                obj.type = node.nodeName.toLowerCase();
                obj.children = [];
                obj.props = serializeProps(node);
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
/* 7 */
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
            return obj;
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var element = __webpack_require__(15);

module.exports = {
    updateElement: element.update
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(11);
module.exports.component = __webpack_require__(3).component;
module.exports.collection = __webpack_require__(1);
module.exports.update = __webpack_require__(8).updateElement;
module.exports.transform = __webpack_require__(6).transform;
module.exports.html = __webpack_require__(4);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = __webpack_require__(2);
var bind = __webpack_require__(12);
var component = __webpack_require__(3);

var _require = __webpack_require__(0),
    TAG = _require.TAG,
    REGEX = _require.REGEX;

var Doz = function () {
    function Doz() {
        var _this = this;

        var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Doz);

        var template = '<' + TAG.VIEW + '></' + TAG.VIEW + '>';

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

        this.cfg = extend(cfg, {
            components: [],
            actions: {}
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
            action: {
                value: bind(this.cfg.actions, this),
                enumerable: true
            },
            mount: {
                value: function value(_template, root) {
                    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._tree;


                    if (typeof root === 'string') {
                        root = document.querySelector(root);
                    }

                    root = root || parent._rootElement;

                    if (!(root instanceof HTMLElement)) {
                        throw new TypeError('root must be an HTMLElement or an valid selector like #example-root');
                    }

                    //console.log('ROOT', root.innerHTML);
                    var autoCmp = {
                        tag: TAG.ROOT,
                        cfg: {
                            props: {},
                            template: function template() {
                                return _template;
                            }
                        }
                    };

                    return component.getInstances({
                        root: root,
                        template: '<' + TAG.ROOT + '></' + TAG.ROOT + '>',
                        view: this,
                        parentCmp: parent,
                        isStatic: false,
                        autoCmp: autoCmp,
                        mount: true
                    });
                },
                enumerable: true
            }
        });

        this.cfg.components.forEach(function (cmp) {
            if ((typeof cmp === 'undefined' ? 'undefined' : _typeof(cmp)) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
                _this._components[cmp.tag] = cmp;
            }
        });

        this._components[TAG.VIEW] = {
            tag: TAG.VIEW,
            cfg: {
                props: cfg.props || {},
                template: function template() {
                    return typeof cfg.template === 'function' ? cfg.template() : cfg.template;
                }
            }
        };

        this._tree = component.getInstances({ root: this.cfg.root, template: template, view: this }) || [];
    }

    _createClass(Doz, [{
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
    }]);

    return Doz;
}();

module.exports = Doz;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function bind(obj, context) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        throw new TypeError('expected an object');
    }

    var target = Object.assign({}, obj);

    var keys = Object.keys(obj);

    for (var i = keys.length - 1; i >= 0; --i) {
        var item = target[keys[i]];
        if (typeof item === 'function') {
            target[keys[i]] = item.bind(context);
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
            target[keys[i]] = bind(item, context);
        }
    }

    return target;
}

module.exports = bind;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var proxy = __webpack_require__(14);
var events = __webpack_require__(5);

function delay(cb) {
    if (window.requestAnimationFrame !== undefined) return window.requestAnimationFrame(cb);else return window.setTimeout(cb);
}

function updateChildren(instance, changes) {

    if (!instance.updateChildrenProps) return;

    var children = Object.keys(instance.children);

    children.forEach(function (i) {
        changes.forEach(function (item) {
            if (instance.children[i]._publicProps.hasOwnProperty(item.currentPath) && instance.children[i].props.hasOwnProperty(item.currentPath)) instance.children[i].props[item.currentPath] = item.newValue;
        });
    });
}

function updateBound(instance, changes) {
    changes.forEach(function (item) {
        if (instance._boundElements.hasOwnProperty(item.property)) {
            instance._boundElements[item.property].forEach(function (element) {
                element.value = item.newValue;
            });
        }
    });
}

function create(instance, props) {
    instance.props = proxy.create(props, true, function (changes) {
        instance.render();
        updateBound(instance, changes);
        //drawIterated(instance);
        if (instance._isCreated) {
            delay(function () {
                updateChildren(instance, changes);
                events.callUpdate(instance);
            });
        }
    });

    proxy.beforeChange(instance.props, function () {
        var res = events.callBeforeUpdate(instance);
        if (res === false) return false;
    });
}

module.exports = {
    create: create
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * 	Observable Slim
 *	Version 0.0.1
 * 	https://github.com/elliotnb/observable-slim
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	Observable Slim is a singleton that allows you to observe changes made to an object and any nested
 *	children of that object. It is intended to assist with one-way data binding, that is, in MVC parlance,
 *	reflecting changes in the model to the view. Observable Slim aspires to be as lightweight and easily
 *	understood as possible. Minifies down to roughly 3000 characters.
 */

var ObservableSlim = function () {

    // An array that stores all of the observables created through the public create() method below.
    var observables = [];
    // An array of all the objects that we have assigned Proxies to
    var targets = [];

    // An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
    // 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object
    var targetsProxy = [];

    var observableCache = [];
    var originalObservableCache = null;

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

    /*	Function: _create
                Private internal function that is invoked to create a new ES6 Proxy whose changes we can observe through
                the Observerable.observe() method.
              Parameters:
                target 				- required, plain JavaScript object that we want to observe for changes.
                domDelay 			- batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
                originalObservable 	- object, the original observable created by the user, exists for recursion purposes,
                                      allows one observable to observe change on any nested/child objects.
                originalPath 		- string, the path of the property in relation to the target on the original observable,
                                      exists for recursion purposes, allows one observable to observe change on any nested/child objects.
              Returns:
                An ES6 Proxy object.
    */
    var _create = function _create(target, domDelay, originalObservable, originalPath) {

        var observable = originalObservable || null;
        var path = originalPath || "";

        var changes = [];

        var _getPath = function _getPath(target, property) {
            if (target instanceof Array) {
                return path !== "" ? path : property;
            } else {
                return path !== "" ? path + "." + property : property;
            }
        };

        var _notifyObservers = function _notifyObservers(numChanges) {

            // if the observable is paused, then we don't want to execute any of the observer functions
            if (observable.paused === true) return;

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
                if (property === "__isProxy") {
                    return true;
                } else if (property === "__getTarget") {
                    return target;
                    // from the perspective of a given observable on a parent object, return the parent object of the given nested object
                } else if (property === "__getParent") {
                    return function (i) {
                        if (typeof i === "undefined") var i = 1;
                        var parentPath = _getPath(target, "__getParent").split(".");
                        parentPath.splice(-(i + 1), i + 1);
                        return _getProperty(observable.proxy, parentPath.join("."));
                    };
                }

                // for performance improvements, we assign this to a variable so we do not have to lookup the property value again
                var targetProp = target[property];

                // the logic and need behind this next block of code is a little complicated... we want to support multiple observables on the same target object
                // and if the target object is modified via one Proxy, then we want *all* observables to be notified of that change -- including on all nested
                // objects of the original target object. in order to do that, we must create proxies recursively the entire nested target object. we used to complete
                // that recursive initalization in the public 'create' method, but we found that it was too taxing for very large deeply nested objects on older browsers
                // like IE11. this section of code now adds the new proxies on nested objects as soon as they are accessed and for *all* other observables that are monitoring
                // the same object

                // mark that the current observable has already 'accessed' this property
                observableCache.push(observable);

                // if this is the first observable to access the property, then mark this observable as the initiator
                if (originalObservableCache === null) {
                    originalObservableCache = observable;

                    // loop over all other observables that are observing this same object
                    var a = targets.indexOf(target);
                    var targetProxyList = targetsProxy[a];
                    var b = targetProxyList.length;
                    if (b > 1) {
                        while (b--) {
                            // if the other observable watching this same target has not yet accessed this property, then proceed to...
                            if (observableCache.indexOf(targetProxyList[b].observable) === -1) {
                                // ...access the same property on the other proxies, this will trigger the 'get' method which will
                                // create a new proxy for the object we've just accessed
                                targetProxyList[b].proxy[property];
                            }
                        }
                    }

                    // once we've fully exited out of the recursive 'get' calls and we're back to the original observable that accessed
                    // target[property] then we can reset the observable cache and original observable back to empty
                    originalObservableCache = null;
                    observableCache = [];
                }

                // if we are traversing into a new object, then we want to record path to that object and return a new observable.
                // recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
                // the target object and any objects nested within.
                if (targetProp instanceof Object && targetProp !== null && target.hasOwnProperty(property) && typeof targetProp.__isProxy === "undefined") {

                    // if we've previously setup a proxy on this target, then...
                    var a = targets.indexOf(targetProp);
                    if (a > -1) {
                        var currentTargetsProxy = targetsProxy[a];
                        var b = currentTargetsProxy.length;
                        // loop through the proxies we've already created, if a given observable has already created the same proxy
                        // for the same target object, then we can return that proxy (we don't need to create a new proxy).
                        while (b--) {
                            if (currentTargetsProxy[b].observable === observable) return currentTargetsProxy[b].proxy;
                        }
                    }

                    // if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
                    // have to create a new proxy for it
                    var newPath = path !== "" ? path + "." + property : property;

                    return _create(targetProp, domDelay, observable, newPath);
                } else {
                    return targetProp;
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
                changes.push({ "type": "delete", "target": target, "property": property, "newValue": null, "previousValue": previousValue[property], "currentPath": currentPath, "proxy": proxy });

                if (typeof observable.beforeChange === "function") {
                    var res = observable.beforeChange(changes);
                    if (res === false) return false;
                }

                if (originalChange === true) {

                    // if we have already setup a proxy on this target, then...
                    var a = targets.indexOf(target);
                    if (a > -1) {

                        // loop over each proxy and see if the target for this change has any other proxies
                        var b = targetsProxy[a].length;
                        while (b--) {
                            // if the same target has a different proxy
                            if (targetsProxy[a][b].proxy !== proxy) {
                                // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                                // prevent a change on dupProxy from re-triggering the same change on other proxies)
                                dupProxy = targetsProxy[a][b].proxy;

                                // make the same delete on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                                // on any other proxies so that the previousValue can show up correct for the other proxies
                                delete targetsProxy[a][b].proxy[property];
                            }
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

                    var typeOfTargetProp = typeof targetProp === "undefined" ? "undefined" : _typeof(targetProp);

                    // get the path of the object property being modified
                    var currentPath = _getPath(target, property);

                    // determine if we're adding something new or modifying somethat that already existed
                    var type = "update";
                    if (typeOfTargetProp === "undefined") type = "add";

                    // store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct
                    changes.push({ "type": type, "target": target, "property": property, "newValue": value, "previousValue": receiver[property], "currentPath": currentPath, "proxy": proxy });

                    if (typeof observable.beforeChange === "function") {
                        var res = observable.beforeChange(changes);
                        if (res === false) return false;
                    }

                    // !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
                    // if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
                    // observers can be modified of the change that has occurred.
                    if (originalChange === true) {

                        // if we have already setup a proxy on this target, then...
                        var a = targets.indexOf(target);
                        if (a > -1) {

                            // loop over each proxy and see if the target for this change has any other proxies
                            var currentTargetProxy = targetsProxy[a];
                            var b = currentTargetProxy.length;
                            while (b--) {
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
                        };

                        // if the property being overwritten is an object, then that means this observable
                        // will need to stop monitoring this object and any nested objects underneath else they'll become
                        // orphaned and grow memory usage. we excute this on a setTimeout so that the clean-up process does not block
                        // the UI rendering -- there's no need to execute the clean up immediately
                        setTimeout(function () {

                            if (typeOfTargetProp instanceof Object) {

                                // loop over each property and recursively invoke the `iterate` function for any
                                // objects nested on targetProp
                                (function iterate(obj) {
                                    for (var property in obj) {
                                        var objProp = obj[property];
                                        if (objProp instanceof Object && objProp !== null) iterate(objProp);
                                    }

                                    // if there are any existing target objects (objects that we're already observing)...
                                    var c = targets.indexOf(obj);
                                    if (c > -1) {

                                        // ...then we want to determine if the observables for that object match our current observable
                                        var currentTargetProxy = targetsProxy[c];
                                        var d = currentTargetProxy.length;

                                        while (d--) {
                                            // if we do have an observable monitoring the object thats about to be overwritten
                                            // then we can remove that observable from the target object
                                            if (observable === currentTargetProxy[d].observable) {
                                                currentTargetProxy.splice(d, 1);
                                                break;
                                            }
                                        }

                                        // if there are no more observables assigned to the target object, then we can remove
                                        // the target object altogether. this is necessary to prevent growing memory consumption particularly with large data sets
                                        if (currentTargetProxy.length == 0) {
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
                    };

                    // notify the observer functions that the target has been modified
                    _notifyObservers(changes.length);
                }
                return true;
            }

            // create the proxy that we'll use to observe any changes
        };var proxy = new Proxy(target, handler);

        // we don't want to create a new observable if this function was invoked recursively
        if (observable === null) {
            observable = { "target": target, "domDelay": domDelay, "proxy": proxy, "observers": [], "paused": false, "path": path };
            observables.push(observable);
        }

        // store the proxy we've created so it isn't re-created unnecessairly via get handler
        var proxyItem = { "target": target, "proxy": proxy, "observable": observable };

        var i = targets.indexOf(target);

        // if we have already created a Proxy for this target object then we add it to the corresponding array
        // on targetsProxy (targets and targetsProxy work together as a Hash table indexed by the actual target object).
        if (i > -1) {
            targetsProxy[i].push(proxyItem);
            // else this is a target object that we have not yet created a Proxy for, so we must add it to targets,
            // and push a new array on to targetsProxy containing the new Proxy
        } else {
            targets.push(target);
            targetsProxy.push([proxyItem]);
        }

        return proxy;
    };

    return {
        /*	Method:
                Public method that is invoked to create a new ES6 Proxy whose changes we can observe
                through the Observerable.observe() method.
              Parameters
                target - Object, required, plain JavaScript object that we want to observe for changes.
                domDelay - Boolean, required, if true, then batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
                observer - Function, optional, will be invoked when a change is made to the proxy.
              Returns:
                An ES6 Proxy object.
        */
        create: function create(target, domDelay, observer) {

            // test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
            // we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
            if (target.__isProxy === true) {
                var target = target.__getTarget;
                //if it is, then we should throw an error. we do not allow creating proxies of proxies
                // because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
                //throw new Error("ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.");
            }

            // emit off the _create() method -- it will create a new observable and proxy and return the proxy
            var proxy = _create(target, domDelay);

            // assign the observer function
            if (typeof observer === "function") this.observe(proxy, observer);

            return proxy;
        },

        /*	Method: observe
                This method is used to add a new observer function to an existing proxy.
              Parameters:
                proxy 	- the ES6 Proxy returned by the create() method. We want to observe changes made to this object.
                observer 	- this function will be invoked when a change is made to the observable (not to be confused with the
                              observer defined in the create() method).
              Returns:
                Nothing.
        */
        observe: function observe(proxy, observer) {
            // loop over all the observables created by the _create() function
            var i = observables.length;
            while (i--) {
                if (observables[i].proxy === proxy) {
                    observables[i].observers.push(observer);
                    break;
                }
            };
        },

        /*	Method: pause
                This method will prevent any observer functions from being invoked when a change occurs to a proxy.
              Parameters:
                proxy 	- the ES6 Proxy returned by the create() method.
        */
        pause: function pause(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].proxy === proxy) {
                    observables[i].paused = true;
                    foundMatch = true;
                    break;
                }
            };

            if (foundMatch == false) throw new Error("ObseravableSlim could not pause observable -- matching proxy not found.");
        },

        /*	Method: resume
                This method will resume execution of any observer functions when a change is made to a proxy.
              Parameters:
                proxy 	- the ES6 Proxy returned by the create() method.
        */
        resume: function resume(proxy) {
            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].proxy === proxy) {
                    observables[i].paused = false;
                    foundMatch = true;
                    break;
                }
            };

            if (foundMatch == false) throw new Error("ObseravableSlim could not resume observable -- matching proxy not found.");
        },

        /*	Method: remove
                This method will remove the observable and proxy thereby preventing any further callback observers for
                changes occuring to the target object.
              Parameters:
                proxy 	- the ES6 Proxy returned by the create() method.
        */
        remove: function remove(proxy) {

            var matchedObservable = null;
            var foundMatch = false;

            var c = observables.length;
            while (c--) {
                if (observables[c].proxy === proxy) {
                    matchedObservable = observables[c];
                    foundMatch = true;
                    break;
                }
            };

            var a = targetsProxy.length;
            while (a--) {
                var b = targetsProxy[a].length;
                while (b--) {
                    if (targetsProxy[a][b].observable === matchedObservable) {
                        targetsProxy[a].splice(b, 1);
                        if (targetsProxy[a].length == 0) {
                            targetsProxy.splice(a, 1);
                            targets.splice(a, 1);
                        };
                    }
                };
            };

            if (foundMatch === true) {
                observables.splice(c, 1);
            }
        },

        /*	Method: beforeChange
        		This method accepts a function will be invoked before changes.
        Parameters:
        proxy 	- the ES6 Proxy returned by the create() method.
        callback 	- Function, will be invoked before every change is made to the proxy, if it returns false no changes will be made.
        */
        beforeChange: function beforeChange(proxy, callback) {
            if (typeof callback !== 'function') throw new Error("Callback function is required");

            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].proxy === proxy) {
                    observables[i].beforeChange = callback;
                    foundMatch = true;
                    break;
                }
            };

            if (foundMatch == false) throw new Error("ObseravableSlim -- matching proxy not found.");
        }
    };
}();

// Export in a try catch to prevent this from erroring out on older browsers
try {
    module.exports = ObservableSlim;
} catch (err) {};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(16),
    attach = _require.attach,
    updateAttributes = _require.updateAttributes;

var deadChildren = [];

var _require2 = __webpack_require__(0),
    INSTANCE = _require2.INSTANCE;

function isChanged(nodeA, nodeB) {
    return (typeof nodeA === 'undefined' ? 'undefined' : _typeof(nodeA)) !== (typeof nodeB === 'undefined' ? 'undefined' : _typeof(nodeB)) || typeof nodeA === 'string' && nodeA !== nodeB || nodeA.type !== nodeB.type || nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial) {
    if (typeof node === 'undefined') return;

    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    var $el = document.createElement(node.type);

    attach($el, node.props, cmp);

    node.children.map(function (item) {
        return create(item, cmp, initial);
    }).forEach($el.appendChild.bind($el));

    if (node.type.indexOf('-') !== -1 && !initial) {
        cmp._processing.push({ node: $el, action: 'create' });
    }

    return $el;
}

function update($parent, newNode, oldNode) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var cmp = arguments[4];
    var initial = arguments[5];


    if (!oldNode) {
        var rootElement = create(newNode, cmp, initial);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    } else if (isChanged(newNode, oldNode)) {
        var _rootElement = create(newNode, cmp, initial);
        $parent.replaceChild(_rootElement, $parent.childNodes[index]);
        return _rootElement;
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

        /*if (newNode.props[ATTR.DYNAMIC] && updated.length) {
            cmp._processing.push({node: $parent.childNodes[index], action: 'update'});
            return;
        }*/

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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR;

var castStringTo = __webpack_require__(7);
var objectPath = __webpack_require__(17);

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
    return ['INPUT', 'TEXTAREA'].indexOf($target.nodeName) !== -1;
}

function setAttribute($target, name, value, cmp) {
    if (isCustomAttribute(name)) {} else if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
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
    if (isCustomAttribute(name)) {} else if (name === 'className') {
        $target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
        removeBooleanAttribute($target, name);
    } else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal) {
    if (!newVal) {
        removeAttribute($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
        setAttribute($target, name, newVal);
    }
}

function updateAttributes($target, newProps) {
    var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cmp = arguments[3];

    var props = Object.assign({}, newProps, oldProps);
    var updated = [];
    Object.keys(props).forEach(function (name) {
        //const res = newProps[name] !== oldProps[name];
        updateAttribute($target, name, newProps[name], oldProps[name]);
        if (newProps[name] !== oldProps[name]) {
            var obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    });

    return updated;
}

function isCustomAttribute(name) {
    return isEventAttribute(name) || isBindAttribute(name) || isRefAttribute(name) || name === 'forceupdate';
}

function setBooleanAttribute($target, name, value) {
    if (value) {
        $target.setAttribute(name, value);
        $target[name] = true;
    } else {
        $target[name] = false;
    }
}

function removeBooleanAttribute($target, name) {
    $target.removeAttribute(name);
    $target[name] = false;
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

    // Add only if is a static component
    if (cmp._isStatic) $target.dataset[name] = value;

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

    if (typeof value === 'function') $target.addEventListener(extractEventName(name), value);
}

function setBind($target, name, value, cmp) {
    if (!isBindAttribute(name) || !canBind($target)) return;
    if (typeof cmp.props[value] !== 'undefined') {
        ['compositionstart', 'compositionend', 'input', 'change'].forEach(function (event) {
            $target.addEventListener(event, function () {
                cmp.props[value] = this.value;
            });
        });
        if (cmp._boundElements.hasOwnProperty(value)) {
            cmp._boundElements[value].push($target);
        } else {
            cmp._boundElements[value] = [$target];
        }
    }
}

function setRef($target, name, value, cmp) {
    if (!isRefAttribute(name)) return;
    cmp.ref[value] = $target;
}

function attach($target, props, cmp) {
    Object.keys(props).forEach(function (name) {
        setAttribute($target, name, props[name], cmp);
        addEventListener($target, name, props[name], cmp);
        setBind($target, name, props[name], cmp);
        setRef($target, name, props[name], cmp);
    });

    for (var i in $target.dataset) {
        if ($target.dataset.hasOwnProperty(i) && REGEX.IS_LISTENER.test(i)) {
            addEventListener($target, i, $target.dataset[i], cmp);
        }
    }
}

module.exports = {
    attach: attach,
    updateAttributes: updateAttributes
};

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function create(instance) {

    if (typeof instance.store === 'string') {
        if (instance.view._stores[instance.store] !== undefined) {
            throw new Error('Store already defined: ' + instance.store);
        }
        instance.view._stores[instance.store] = instance.props;
    }
}

module.exports = {
    create: create
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function create(instance) {

    if (typeof instance.id === 'string') {
        if (instance.view._ids[instance.id] !== undefined) {
            throw new Error('ID already defined: ' + instance.id);
        }
        instance.view._ids[instance.id] = instance;
    }
}

module.exports = {
    create: create
};

/***/ }),
/* 20 */
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

    if (props[ATTR.CLASS] !== undefined) {
        dProps['class'] = props[ATTR.CLASS];
        delete props[ATTR.CLASS];
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

/***/ })
/******/ ]);
}); 