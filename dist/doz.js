// [DOZ]  Build version: 1.25.0  
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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
    registerDirective = _require.registerDirective;

function directive(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    registerDirective(name, options);
}

module.exports = Object.assign({
    directive: directive
}, __webpack_require__(28), __webpack_require__(29));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    COMPONENT_DYNAMIC_INSTANCE: '__DOZ_COMPONENT_DYNAMIC_INSTANCE__',
    COMPONENT_INSTANCE: '__DOZ_COMPONENT_INSTANCE__',
    COMPONENT_ROOT_INSTANCE: '__DOZ_COMPONENT_ROOT_INSTANCE__',
    DEFAULT_SLOT_KEY: '__DEFAULT__',
    NS: {
        SVG: 'http://www.w3.org/2000/svg'
    },
    TAG: {
        ROOT: 'dz-root',
        EACH: 'dz-each-root', //not in use
        APP: 'dz-app',
        EMPTY: 'dz-empty',
        MOUNT: 'dz-mount',
        SLOT: 'dz-slot',
        SLOT_UPPERCASE: 'DZ-SLOT',
        SUFFIX_ROOT: '-root',
        TEXT_NODE_PLACE: 'dz-text-node'
    },
    REGEX: {
        IS_DIRECTIVE: /^d[-:][\w-]+$/,
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        IS_PARENT_METHOD: /^parent.(.*)/,
        IS_STRING_QUOTED: /^"\w+"/,
        IS_SVG: /^svg$/,
        IS_CLASS: /^(class\s|function\s+_class|function.*\s+_classCallCheck\(this, .*\))|(throw new TypeError\("Cannot call a class)|(function.*\.__proto__\|\|Object\.getPrototypeOf\(.*?\))/i,
        GET_LISTENER: /^this.(.*)\((.*)\)/,
        GET_LISTENER_SCOPE: /^scope.(.*)\((.*)\)/,
        IS_LISTENER_SCOPE: /(^|\()scope[.)]/g,
        TRIM_QUOTES: /^["'](.*)["']$/,
        THIS_TARGET: /\B\$this(?!\w)/g,
        HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/ig,
        HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
        MATCH_NLS: /\n\s+/gm,
        REPLACE_QUOT: /"/g,
        REPLACE_D_DIRECTIVE: /^d[-:]/
    },
    ATTR: {
        // Attributes for both
        FORCE_UPDATE: 'forceupdate'
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var data = __webpack_require__(27);

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
    //data.directives = {};
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

/**
 * Register a directive to global
 * @param name
 * @param cfg
 */
function registerDirective(name) {
    var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (typeof name !== 'string') {
        throw new TypeError('Doz directive name must be a string');
    }

    if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object' || !cfg) {
        throw new TypeError('Doz directive config must be an object');
    }

    if (name[0] === ':') {
        cfg._onlyDozComponent = true;
        name = name.substr(1);
    }

    name = name.toLowerCase();
    var namePart = [];
    if (name.indexOf('-') !== -1) {
        namePart = name.split('-');
        name = namePart[0];
        namePart.shift();
    }

    cfg.name = name;
    cfg._keyArguments = namePart.map(function (item) {
        return item.substr(1);
    }); // remove $

    if (Object.prototype.hasOwnProperty.call(data.directives, name)) console.warn('Doz', 'directive ' + name + ' overwritten');

    data.directives[name] = cfg;
}

module.exports = {
    registerComponent: registerComponent,
    registerPlugin: registerPlugin,
    getComponent: getComponent,
    registerDirective: registerDirective,
    removeAll: removeAll,
    data: data
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function delay(cb) {
    if (window.requestAnimationFrame !== undefined) return window.requestAnimationFrame(cb);else return window.setTimeout(cb);
}

module.exports = delay;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var delay = __webpack_require__(3);
var directive = __webpack_require__(0);

function callBeforeCreate(context) {
    directive.callAppComponentBeforeCreate(context);
    directive.callComponentBeforeCreate(context);
    if (typeof context.onBeforeCreate === 'function') {
        return context.onBeforeCreate.call(context);
    }
}

function callCreate(context) {
    directive.callAppComponentCreate(context);
    directive.callComponentCreate(context);
    if (typeof context.onCreate === 'function') {
        context.onCreate.call(context);
    }
    context.app.emit('componentCreate', context);
}

function callConfigCreate(context) {
    directive.callAppComponentConfigCreate(context);
    if (typeof context.onConfigCreate === 'function') {
        context.onConfigCreate.call(context);
    }
    if (context.parent && typeof context.parent[context.__onConfigCreate] === 'function') {
        context.parent[context.__onConfigCreate].call(context.parent, context);
    }
    context.app.emit('componentConfigCreate', context);
}

function callBeforeMount(context) {
    directive.callAppComponentBeforeMount(context);
    directive.callComponentBeforeMount(context);
    if (typeof context.onBeforeMount === 'function') {
        return context.onBeforeMount.call(context);
    }
}

function callMount(context) {
    directive.callAppComponentMount(context);
    directive.callComponentMount(context);
    if (typeof context.onMount === 'function') {
        context.onMount.call(context);
    }
    context.app.emit('componentMount', context);
}

function callMountAsync(context) {
    delay(function () {
        directive.callAppComponentMountAsync(context);
        directive.callComponentMountAsync(context);
    });
    if (typeof context.onMountAsync === 'function') {
        delay(function () {
            return context.onMountAsync.call(context);
        });
    }
    context.app.emit('componentMountAsync', context);
}

function callBeforeUpdate(context, changes) {
    directive.callAppComponentBeforeUpdate(context, changes);
    directive.callComponentBeforeUpdate(context, changes);
    if (typeof context.onBeforeUpdate === 'function') {
        return context.onBeforeUpdate.call(context, changes);
    }
}

function callUpdate(context, changes) {
    directive.callAppComponentUpdate(context, changes);
    directive.callComponentUpdate(context, changes);
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context, changes);
    }
    context.app.emit('componentUpdate', context, changes);
}

function callDrawByParent(context, newNode, oldNode) {
    if (!context) return;

    directive.callAppComponentDrawByParent(context, newNode, oldNode);

    if (typeof context.onDrawByParent === 'function') {
        return context.onDrawByParent.call(context, newNode, oldNode);
    }
    if (context.parent && typeof context.parent[context.__onDrawByParent] === 'function') {
        return context.parent[context.__onDrawByParent].call(context.parent, context, newNode, oldNode);
    }
    //context.app.emit('componentDrawByParent', context, changes);
}

function callAfterRender(context, changes) {
    directive.callAppComponentAfterRender(context, changes);
    directive.callComponentAfterRender(context, changes);
    if (typeof context.onAfterRender === 'function') {
        return context.onAfterRender.call(context, changes);
    }
}

function callBeforeUnmount(context) {
    directive.callAppComponentBeforeUnmount(context);
    directive.callComponentBeforeUnmount(context);
    if (typeof context.onBeforeUnmount === 'function') {
        return context.onBeforeUnmount.call(context);
    }
}

function callUnmount(context) {
    directive.callAppComponentUnmount(context);
    directive.callComponentUnmount(context);
    if (typeof context.onUnmount === 'function') {
        context.onUnmount.call(context);
    }
    context.app.emit('componentUnmount', context);
}

function callBeforeDestroy(context) {
    directive.callAppComponentBeforeDestroy(context);
    directive.callComponentBeforeDestroy(context);
    if (typeof context.onBeforeDestroy === 'function') {
        return context.onBeforeDestroy.call(context);
    }
}

function callDestroy(context) {
    directive.callAppComponentDestroy(context);
    directive.callComponentDestroy(context);
    context.app.emit('componentDestroy', context);

    var style = document.getElementById(context.uId + '--style');
    if (style) {
        style.parentNode.removeChild(style);
    }

    if (context._unmountedPlaceholder && context._unmountedPlaceholder.parentNode) context._unmountedPlaceholder.parentNode.removeChild(context._unmountedPlaceholder);

    if (typeof context.onDestroy === 'function') {
        context.onDestroy.call(context);
        context = null;
    }
}

function callLoadProps(context) {
    directive.callAppComponentLoadProps(context);
    directive.callComponentLoadProps(context);
    if (typeof context.onLoadProps === 'function') {
        context.onLoadProps.call(context);
    }
    context.app.emit('componentLoadProps', context);
}

module.exports = {
    callBeforeCreate: callBeforeCreate,
    callCreate: callCreate,
    callConfigCreate: callConfigCreate,
    callBeforeMount: callBeforeMount,
    callMount: callMount,
    callMountAsync: callMountAsync,
    callBeforeUpdate: callBeforeUpdate,
    callUpdate: callUpdate,
    callDrawByParent: callDrawByParent,
    callAfterRender: callAfterRender,
    callBeforeUnmount: callBeforeUnmount,
    callUnmount: callUnmount,
    callBeforeDestroy: callBeforeDestroy,
    callDestroy: callDestroy,
    callLoadProps: callLoadProps
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var castStringTo = __webpack_require__(6);
var dashToCamel = __webpack_require__(7);

var _require = __webpack_require__(1),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR,
    TAG = _require.TAG;

var regExcludeSpecial = new RegExp('</?' + TAG.TEXT_NODE_PLACE + '?>$');
var directive = __webpack_require__(0);

var selfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
};

var elementsClosedByOpening = {
    li: { li: true },
    p: { p: true, div: true },
    td: { td: true, th: true },
    th: { td: true, th: true }
};

var elementsClosedByClosing = {
    li: { ul: true, ol: true },
    a: { div: true },
    b: { div: true },
    i: { div: true },
    p: { div: true },
    td: { tr: true, table: true },
    th: { tr: true, table: true }
};

function last(arr) {
    return arr[arr.length - 1];
}

function removeNLS(str) {
    return str.replace(REGEX.MATCH_NLS, '');
}

var Element = function () {
    function Element(name, props, isSVG) {
        _classCallCheck(this, Element);

        //if(name === 'slot') name = 'dzslot';

        this.type = name;
        this.props = Object.assign({}, props);
        this.children = [];
        this.isSVG = isSVG || REGEX.IS_SVG.test(name);
        //this.childrenHasKey = false;
    }

    _createClass(Element, [{
        key: 'appendChild',
        value: function appendChild(node) {
            this.children.push(node);
            return node;
        }
    }]);

    return Element;
}();

function compile(data, cmp) {

    if (!data) return '';

    var root = new Element(null, {});
    var stack = [root];
    var currentParent = root;
    var lastTextPos = -1;
    var match = void 0;
    var props = void 0;

    while (match = REGEX.HTML_MARKUP.exec(data)) {

        if (lastTextPos > -1) {
            if (lastTextPos > -1 && lastTextPos + match[0].length < REGEX.HTML_MARKUP.lastIndex) {
                // remove new line space
                var text = removeNLS(data.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                // if has content
                if (text) currentParent.appendChild(text);
            }
        }

        lastTextPos = REGEX.HTML_MARKUP.lastIndex;
        if (match[0][1] === '!') {
            // this is a comment or style
            continue;
        }

        // exclude special text node
        if (regExcludeSpecial.test(match[0])) {
            continue;
        }

        // transform slot to dz-slot
        if (match[2] === 'slot') match[2] = TAG.SLOT;

        if (!match[1]) {
            // not </ tags
            props = {};
            for (var attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
                props[attMatch[2]] = removeNLS(attMatch[5] || attMatch[6] || '');
                propsFixer(match[0].substring(1, match[0].length - 1), attMatch[2], props[attMatch[2]], props, null);
            }

            if (!match[4] && elementsClosedByOpening[currentParent.type]) {
                if (elementsClosedByOpening[currentParent.type][match[2]]) {
                    stack.pop();
                    currentParent = last(stack);
                }
            }

            // Replace KEY attribute with a dataset
            /*if (props[ATTR.KEY] !== undefined) {
                props['data-key'] = props[ATTR.KEY];
                delete props[ATTR.KEY];
            }*/

            /*if (props['data-key'] !== undefined && !currentParent.childrenHasKey)
                currentParent.childrenHasKey = true;*/

            //if (/-/.test(match[2]) && /-/.test(currentParent.type))
            //cmp._maybeSlot = true;

            currentParent = currentParent.appendChild(new Element(match[2], props, currentParent.isSVG));

            stack.push(currentParent);
        }

        if (match[1] || match[4] || selfClosingElements[match[2]]) {
            // </ or /> or <br> etc.
            while (true) {
                if (currentParent.type === match[2]) {
                    stack.pop();
                    currentParent = last(stack);
                    break;
                } else {
                    // Trying to close current tag, and move on
                    if (elementsClosedByClosing[currentParent.type]) {
                        if (elementsClosedByClosing[currentParent.type][match[2]]) {
                            stack.pop();
                            currentParent = last(stack);
                            continue;
                        }
                    }
                    // Use aggressive strategy to handle unmatching markups.
                    break;
                }
            }
        }
    }

    if (root.children.length > 1) {
        root.type = TAG.ROOT;
    } else if (root.children.length) {
        return root.children[0];
    }

    return root;
}

function serializeProps($node) {
    var props = {};

    if ($node.attributes) {
        var attributes = Array.from($node.attributes);
        for (var j = attributes.length - 1; j >= 0; --j) {
            var attr = attributes[j];
            propsFixer($node.nodeName, attr.name, attr.nodeValue, props, $node);
        }
    }
    return props;
}

function propsFixer(nName, aName, aValue, props, $node) {

    if (REGEX.IS_STRING_QUOTED.test(aValue)) aValue = aValue.replace(REGEX.REPLACE_QUOT, '&quot;');

    var isDirective = REGEX.IS_DIRECTIVE.test(aName);

    var propsName = REGEX.IS_CUSTOM_TAG.test(nName) && !isDirective ? dashToCamel(aName) : aName;

    if ( /*!isDirective && */$node) {
        //console.log($node)
        directive.callAppComponentPropsAssignName($node, aName, aValue, isDirective, props, function (newPropsName) {
            propsName = newPropsName;
        });
    }
    props[propsName] = aName === ATTR.FORCE_UPDATE ? true : castStringTo(aValue);
}

module.exports = {
    compile: compile,
    serializeProps: serializeProps,
    propsFixer: propsFixer
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isJSON = __webpack_require__(31);
var isNumber = __webpack_require__(32);
var toJSON = __webpack_require__(33);
var toNumber = __webpack_require__(34);
var typesMap = __webpack_require__(35);

function castStringTo(obj) {

    if (typeof obj !== 'string') {
        return obj;
    }

    if (typesMap.hasOwnProperty(obj)) {
        return typesMap[obj];
    } else if (isJSON(obj)) {
        return toJSON(obj);
    } else if (isNumber(obj)) {
        return toNumber(obj);
    }

    return obj;
}

module.exports = castStringTo;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function dashToCamel(s) {
    return s.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

module.exports = dashToCamel;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = __webpack_require__(1),
    TAG = _require.TAG,
    COMPONENT_ROOT_INSTANCE = _require.COMPONENT_ROOT_INSTANCE,
    REGEX = _require.REGEX;

var observer = __webpack_require__(37);
var hooks = __webpack_require__(4);
var update = __webpack_require__(40).updateElement;
var drawDynamic = __webpack_require__(43);
var proxy = __webpack_require__(12);
var toInlineStyle = __webpack_require__(44);
var queueReady = __webpack_require__(46);
var queueDraw = __webpack_require__(47);
var extendInstance = __webpack_require__(48);
var removeAllAttributes = __webpack_require__(49);
var h = __webpack_require__(16);
var loadLocal = __webpack_require__(50);
var localMixin = __webpack_require__(51);

var _require2 = __webpack_require__(5),
    compile = _require2.compile;

var propsInit = __webpack_require__(18);
var DOMManipulation = __webpack_require__(52);
var directive = __webpack_require__(0);
var cloneObject = __webpack_require__(54);
var toLiteralString = __webpack_require__(19);

var Component = function (_DOMManipulation) {
    _inherits(Component, _DOMManipulation);

    function Component(opt) {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, opt));

        Object.defineProperty(_this, '_isSubclass', {
            value: _this.__proto__.constructor !== Component
        });

        Object.defineProperty(_this, 'uId', {
            value: _this.app.generateUId(),
            enumerable: true
        });

        _this._initRawProps(opt);

        // Assign cfg to instance
        extendInstance(_this, opt.cmp.cfg);

        // Create mixin
        localMixin(_this);

        // Load local components
        loadLocal(_this);

        var beforeCreate = hooks.callBeforeCreate(_this);
        if (beforeCreate === false) return _possibleConstructorReturn(_this);

        // Create observer to props
        observer.create(_this, true);
        // Add callback to ready queue
        queueReady.add(_this);
        // Add callback app draw
        queueDraw.add(_this);
        // Call create
        hooks.callCreate(_this);
        return _this;
    }

    _createClass(Component, [{
        key: 'loadProps',
        value: function loadProps(props) {
            if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') throw new TypeError('Props must be an object');

            this._rawProps = Object.assign({}, props);
            propsInit(this);
            observer.create(this);
            hooks.callLoadProps(this);
        }
    }, {
        key: 'getHTMLElement',
        value: function getHTMLElement() {
            return this._parentElement;
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
        key: 'each',
        value: function each(obj, func) {
            var safe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var res = void 0;
            if (Array.isArray(obj)) {
                if (safe) this.beginSafeRender();
                res = obj.map(func).map(function (stringEl, i) {
                    if (typeof stringEl === 'string') {
                        return stringEl.trim();
                    }
                }).join('');
                if (safe) this.endSafeRender();
            }
            return res;
        }

        // noinspection JSMethodCanBeStatic

    }, {
        key: 'toStyle',
        value: function toStyle(obj) {
            return toInlineStyle(obj);
        }
    }, {
        key: 'render',
        value: function render(initial) {
            var changes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var silentAfterRenderEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (this._renderPause) return;
            this.beginSafeRender();
            var template = this.template(h, this.props);
            this.endSafeRender();
            var next = compile(template, this);
            this.app.emit('draw', next, this._prev, this);
            queueDraw.emit(this, next, this._prev);

            var isOverwritten = false;
            directive.callAppComponentRenderOverwrite(this, changes, next, this._prev, function (overwrite) {
                isOverwritten = overwrite;
            });

            if (!isOverwritten) {
                var rootElement = update(this._cfgRoot, next, this._prev, 0, this, initial);

                //Remove attributes from component tag
                removeAllAttributes(this._cfgRoot, ['style', 'class']);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                    this._parentElement = rootElement.parentNode;
                }
                this._prev = next;
            }

            if (!silentAfterRenderEvent) hooks.callAfterRender(this);

            drawDynamic(this);
        }
    }, {
        key: 'renderPause',
        value: function renderPause() {
            this._renderPause = true;
        }
    }, {
        key: 'renderResume',
        value: function renderResume() {
            var callRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this._renderPause = false;
            if (callRender) this.render();
        }
    }, {
        key: 'mount',
        value: function mount(template) {
            var _this2 = this;

            var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            if (this._unmounted) {
                if (hooks.callBeforeMount(this) === false) return this;

                this._unmountedPlaceholder.parentNode.replaceChild(this._unmountedParentNode, this._unmountedPlaceholder);

                this._unmounted = false;
                this._unmountedParentNode = null;
                this._unmountedPlaceholder = null;

                hooks.callMount(this);

                var _defined = function _defined(child) {
                    _this2.children[child].mount();
                };

                var _defined2 = Object.keys(this.children);

                for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
                    _defined(_defined2[_i2], _i2, _defined2);
                }

                return this;
            } else if (template) {
                if (this._rootElement.nodeType !== 1) {
                    var newElement = document.createElement(this.tag + TAG.SUFFIX_ROOT);
                    this._rootElement.parentNode.replaceChild(newElement, this._rootElement);
                    this._rootElement = newElement;
                    this._rootElement[COMPONENT_ROOT_INSTANCE] = this;
                }

                var root = this._rootElement;

                if (typeof cfg.selector === 'string') root = root.querySelector(cfg.selector);else if (cfg.selector instanceof HTMLElement) root = cfg.selector;

                this._unmounted = false;
                this._unmountedParentNode = null;
                this._unmountedPlaceholder = null;

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

            this._unmountedParentNode = this._rootElement.parentNode;
            this._unmountedPlaceholder = document.createComment(Date.now().toString());

            if (!onlyInstance) {
                this._rootElement.parentNode.parentNode.replaceChild(this._unmountedPlaceholder, this._unmountedParentNode);
            } else if (this._rootElement.parentNode) {
                //this._rootElement.parentNode.innerHTML = '';
                this._rootElement.parentNode.parentNode.removeChild(this._rootElement.parentNode);
            }

            this._unmounted = !byDestroy;

            if (!silently) hooks.callUnmount(this);

            var _defined3 = function _defined3(child) {
                _this3.children[child].unmount(onlyInstance, byDestroy, silently);
            };

            var _defined4 = Object.keys(this.children);

            for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
                _defined3(_defined4[_i4], _i4, _defined4);
            }

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy(onlyInstance) {
            var _this4 = this;

            if (this.unmount(onlyInstance, true) === false) return;

            if (!onlyInstance && (!this._rootElement || hooks.callBeforeDestroy(this) === false /*|| !this._rootElement.parentNode*/)) {
                return;
            }

            var _defined5 = function _defined5(child) {
                _this4.children[child].destroy();
            };

            var _defined6 = Object.keys(this.children);

            for (var _i6 = 0; _i6 <= _defined6.length - 1; _i6++) {
                _defined5(_defined6[_i6], _i6, _defined6);
            }

            hooks.callDestroy(this);
        }

        // noinspection JSMethodCanBeStatic

    }, {
        key: 'template',
        value: function template() {
            return '';
        }
    }, {
        key: '_initTemplate',
        value: function _initTemplate(opt) {
            if (typeof opt.cmp.cfg.template === 'string' && opt.app.cfg.enableExternalTemplate) {
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
            //console.log(this._isSubclass)
            if (!this._isSubclass) {
                this._rawProps = Object.assign({}, typeof opt.cmp.cfg.props === 'function' ? opt.cmp.cfg.props() : opt.cmp.cfg.props, opt.props);

                this._initTemplate(opt);
            } else {
                this._rawProps = Object.assign({}, opt.props);
            }

            Object.defineProperty(this, '_initialProps', {
                value: cloneObject(this._rawProps)
            });
        }
    }, {
        key: 'props',
        set: function set(props) {
            if (typeof props === 'function') props = props();

            this._rawProps = Object.assign({}, props, this._opt ? this._opt.props : {});
            observer.create(this);
            directive.callAppComponentSetProps(this);
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

            directive.callAppComponentSetConfig(this, obj);

            if (_typeof(obj.mixin) === 'object') {
                this.mixin = obj.mixin;
                localMixin(this);
            }

            if (_typeof(obj.components) === 'object') {
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
    }, {
        key: 'isRenderPause',
        get: function get() {
            return this._renderPause;
        }
    }]);

    return Component;
}(DOMManipulation);

module.exports = Component;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var html = __webpack_require__(10);

var _require = __webpack_require__(25),
    scopedInner = _require.scopedInner;

var _require2 = __webpack_require__(1),
    COMPONENT_ROOT_INSTANCE = _require2.COMPONENT_ROOT_INSTANCE,
    COMPONENT_INSTANCE = _require2.COMPONENT_INSTANCE,
    REGEX = _require2.REGEX;

var collection = __webpack_require__(2);
var hooks = __webpack_require__(4);

var _require3 = __webpack_require__(5),
    serializeProps = _require3.serializeProps;

var hmr = __webpack_require__(36);
var Component = __webpack_require__(8);
var propsInit = __webpack_require__(18);
var delay = __webpack_require__(3);
var directive = __webpack_require__(0);

function getComponentName(child) {
    return child.nodeName.toLowerCase();
}

function transformChildStyle(child, parent) {
    if (child.nodeName !== 'STYLE') return;

    var dataSetUId = parent.cmp.uId;
    parent.cmp._rootElement.parentNode.dataset.uid = parent.cmp.uId;

    var tagByData = '[data-uid="' + dataSetUId + '"]';

    scopedInner(child.textContent, dataSetUId, tagByData);

    var emptyStyle = document.createElement('script');
    emptyStyle.type = 'text/style';
    emptyStyle.textContent = ' ';
    emptyStyle.dataset.id = dataSetUId + '--style';
    emptyStyle.dataset.owner = dataSetUId;

    emptyStyle.dataset.ownerByData = tagByData;

    child.parentNode.replaceChild(emptyStyle, child);
    child = emptyStyle.nextSibling;

    return child;
}

function get() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    if (!cfg.root) return;

    cfg.template = typeof cfg.template === 'string' ? html.create(cfg.template) : cfg.template;

    cfg.root.appendChild(cfg.template);

    var componentInstance = null;
    var cmpName = void 0;
    var isChildStyle = void 0;
    var trash = [];

    //console.log(cfg.template);

    function walk($child) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        while ($child) {

            directive.callAppWalkDOM(parent, $child);

            isChildStyle = transformChildStyle($child, parent);

            if (isChildStyle) {
                $child = isChildStyle;
                continue;
            }

            cmpName = getComponentName($child);

            directive.callAppComponentAssignName(parent, $child, function (name) {
                cmpName = name;
            });

            var localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            var cmp = cfg.autoCmp || localComponents[cmpName] || cfg.app._components[cmpName] || collection.getComponent(cmpName);

            var parentElement = void 0;

            if (cmp) {
                var _ret = function () {

                    if (parent.cmp) {
                        var rawChild = $child.outerHTML;
                        parent.cmp.rawChildren.push(rawChild);
                    }

                    // For node created by mount method
                    if (parent.cmp && parent.cmp.mounted) {
                        $child = $child.nextSibling;
                        return 'continue';
                    }

                    if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                        trash.push($child);
                        $child = $child.nextSibling;
                        return 'continue';
                    }

                    var props = serializeProps($child);

                    var componentDirectives = {};

                    var newElement = void 0;
                    //const uId = cfg.app.generateUId();

                    if (typeof cmp.cfg === 'function') {
                        // This implements single function component
                        if (!REGEX.IS_CLASS.test(Function.prototype.toString.call(cmp.cfg))) {
                            var func = cmp.cfg;
                            cmp.cfg = function (_Component) {
                                _inherits(_class, _Component);

                                function _class() {
                                    _classCallCheck(this, _class);

                                    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
                                }

                                return _class;
                            }(Component);
                            cmp.cfg.prototype.template = func;
                        }

                        newElement = new cmp.cfg({
                            tag: cmpName,
                            root: $child,
                            app: cfg.app,
                            props: props,
                            componentDirectives: componentDirectives,
                            parentCmp: parent.cmp || cfg.parent
                            //uId
                        });
                    } else {
                        newElement = new Component({
                            tag: cmpName,
                            cmp: cmp,
                            root: $child,
                            app: cfg.app,
                            props: props,
                            componentDirectives: componentDirectives,
                            parentCmp: parent.cmp || cfg.parent
                            //uId
                        });
                    }

                    if (!newElement) {
                        $child = $child.nextSibling;
                        return 'continue';
                    }

                    if (_typeof(newElement.module) === 'object') {
                        hmr(newElement, newElement.module);
                    }

                    propsInit(newElement);

                    newElement.app.emit('componentPropsInit', newElement);

                    if (hooks.callBeforeMount(newElement) !== false) {

                        newElement._isRendered = true;
                        newElement.render(true);

                        if (!componentInstance) {
                            componentInstance = newElement;
                        }

                        newElement._rootElement[COMPONENT_ROOT_INSTANCE] = newElement;
                        newElement.getHTMLElement()[COMPONENT_INSTANCE] = newElement;

                        // Replace first child if defaultSlot exists with a slot comment
                        if (newElement._defaultSlot && newElement.getHTMLElement().firstChild) {
                            var slotPlaceholder = document.createComment('slot');
                            newElement.getHTMLElement().replaceChild(slotPlaceholder, newElement.getHTMLElement().firstChild);
                        }

                        //$child.insertBefore(newElement._rootElement, $child.firstChild);

                        // This is an hack for call render a second time so the
                        // event onAppDraw and onDrawByParent are fired after
                        // that the component is mounted
                        delay(function () {
                            newElement.render(false, [], true);
                        });

                        hooks.callMount(newElement);
                        hooks.callMountAsync(newElement);
                    }

                    parentElement = newElement;

                    if (parent.cmp) {
                        var n = Object.keys(parent.cmp.children).length++;
                        directive.callAppComponentAssignIndex(newElement, n, function (index) {
                            parent.cmp.children[index] = newElement;
                        });

                        if (parent.cmp.childrenByTag[newElement.tag] === undefined) {
                            parent.cmp.childrenByTag[newElement.tag] = [newElement];
                        } else {
                            parent.cmp.childrenByTag[newElement.tag].push(newElement);
                        }
                    }

                    cfg.autoCmp = null;
                }();

                if (_ret === 'continue') continue;
            }

            if ($child.hasChildNodes()) {
                if (parentElement) {
                    walk($child.firstChild, { cmp: parentElement });
                } else {
                    walk($child.firstChild, { cmp: parent.cmp });
                }
            }

            $child = $child.nextSibling;
        }
    }

    walk(cfg.template);

    var _defined = function _defined($child) {
        return $child.remove();
    };

    for (var _i2 = 0; _i2 <= trash.length - 1; _i2++) {
        _defined(trash[_i2], _i2, trash);
    }

    return componentInstance;
}

module.exports = {
    get: get
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexN = /\n/g;
var regexS = /\s+/g;
var replace = ' ';
var decoder = void 0;

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

        return element;
    },
    decode: function decode(str) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = str;
        return decoder.textContent;
    }
};

module.exports = html;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
// Add tag prefix to animation name inside keyframe
(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)

// Add tag prefix to animation
((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)
 */

function composeStyleInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;

    //tag = tagByData || tag;

    var sanitizeTagForAnimation = tag.replace(/[^\w]/g, '');

    if (/:root/.test(cssContent)) {
        console.warn('[DEPRECATION] the :root pseudo selector is deprecated, use :component or :wrapper instead');
    }

    cssContent = cssContent.replace(/{/g, '{\n').replace(/}/g, '}\n').replace(/^(\s+)?:(component|wrapper|root)(\s+)?{/gm, tag + ' {').replace(/:(component|wrapper|root)/g, '').replace(/(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)/g, '$1 ' + sanitizeTagForAnimation + '-$2').replace(/((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)/g, '$1 ' + sanitizeTagForAnimation + '-$2')
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/[^\s].*{/gm, function (match) {

        if (/^(@|(from|to|\d+%)[^-_])/.test(match)) return match;

        var part = match.split(',');
        var sameTag = new RegExp('^' + tag.replace(/[[\]]/g, '\\$&') + '(\\s+)?{');

        for (var i = 0; i < part.length; i++) {
            part[i] = part[i].trim();
            if (sameTag.test(part[i])) continue;

            if (/^:global/.test(part[i])) part[i] = part[i].replace(':global', '');else part[i] = tag + ' ' + part[i];
        }
        match = part.join(',');
        return match;
    });

    cssContent = cssContent.replace(/\s{2,}/g, ' ').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\n/g, '').trim();

    return cssContent;
}

module.exports = composeStyleInner;

/***/ }),
/* 12 */
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

var delay = __webpack_require__(3);

function sanitize(str) {
    return typeof str === 'string' ? str.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : str;
}

/**
 * ObservableSlim
 * @type {{create, observe, remove, beforeChange, beginRender, endRender}}
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

            // reset calls number after 10ms
            if (autoDomDelay) {
                domDelay = ++calls > 1;
                delay(function () {
                    calls = 0;
                });
            }

            //domDelay = true;

            // execute observer functions on a 10ms setTimeout, this prevents the observer functions from being executed
            // separately on every change -- this is necessary because the observer functions will often trigger UI updates
            if (domDelay === true) {
                delay(function () {
                    if (numChanges === changes.length) {
                        // invoke any functions that are observing changes
                        for (var i = 0; i < observable.observers.length; i++) {
                            observable.observers[i](changes);
                        }changes = [];
                    }
                });
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

                if (target instanceof Date && targetProp instanceof Function && targetProp !== null) {
                    return targetProp.bind(target);
                }

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
                    var value = observable.renderMode ? sanitize(targetProp) : targetProp;

                    var manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, property, true);
                    }

                    return value;
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

                    // determine if we're adding something new or modifying some that already existed
                    var type = 'update';
                    if (typeOfTargetProp === 'undefined') type = 'add';

                    var manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, currentPath, false);
                    }

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
        create: function create(target, domDelay, observer, iterateBeforeCreate) {

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
                    if (typeof iterateBeforeCreate === 'function') {
                        iterateBeforeCreate(target, property);
                    }
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
         * manipulate
         * @description This method allows manipulation data.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        manipulate: function manipulate(proxy, callback) {
            if (typeof callback !== 'function') throw new Error('callback is required');

            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].manipulate = callback;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
        },

        /**
         * beforeChange
         * @description This method accepts a function will be invoked before changes.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        beforeChange: function beforeChange(proxy, callback) {
            if (typeof callback !== 'function') throw new Error('callback is required');

            var i = observables.length;
            var foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].beforeChange = callback;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
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
            if (foundMatch === false) throw new Error('proxy not found.');
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
            if (foundMatch === false) throw new Error('proxy not found.');
        }
    };
}();

module.exports = ObservableSlim;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var castType = __webpack_require__(39);

function manipulate(instance, value, currentPath, onFly, init) {

    if (_typeof(instance.propsType) === 'object') {
        var type = instance.propsType[currentPath];

        if (type !== undefined) {
            value = castType(value, type);
        }
    }

    if (init) {
        onFly = instance.propsConvertOnFly;
    }

    if (instance.propsConvert && instance.propsConvertOnFly === onFly) {
        if (_typeof(instance.propsConvert) === 'object') {
            var propPath = instance.propsConvert[currentPath];
            var func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                return func.call(instance, value);
            }
        }
    }

    if (init) {
        onFly = instance.propsComputedOnFly;
    }

    if (instance.propsComputed && instance.propsComputedOnFly === onFly) {
        if (_typeof(instance.propsComputed) === 'object') {
            var cached = instance._computedCache.get(currentPath);
            if (cached === undefined) {
                cached = new Map();
                instance._computedCache.set(currentPath, cached);
            } else {
                var cachedValue = cached.get(value);
                if (cachedValue !== undefined) {
                    return cachedValue;
                }
            }
            var _propPath = instance.propsComputed[currentPath];
            var _func = instance[_propPath] || _propPath;
            if (typeof _func === 'function') {
                var result = _func.call(instance, value);
                cached.set(value, result);
                return result;
            }
        }
    }

    return value;
}

module.exports = manipulate;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(41),
    attach = _require.attach,
    updateAttributes = _require.updateAttributes;

var _require2 = __webpack_require__(1),
    TAG = _require2.TAG,
    NS = _require2.NS,
    COMPONENT_INSTANCE = _require2.COMPONENT_INSTANCE,
    COMPONENT_ROOT_INSTANCE = _require2.COMPONENT_ROOT_INSTANCE,
    DEFAULT_SLOT_KEY = _require2.DEFAULT_SLOT_KEY;

var canDecode = __webpack_require__(15);
var hooks = __webpack_require__(4);

var storeElementNode = Object.create(null);
var deadChildren = [];

function isChanged(nodeA, nodeB) {
    return (typeof nodeA === 'undefined' ? 'undefined' : _typeof(nodeA)) !== (typeof nodeB === 'undefined' ? 'undefined' : _typeof(nodeB)) || typeof nodeA === 'string' && nodeA !== nodeB || nodeA.type !== nodeB.type || nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial, cmpParent) {
    if (typeof node === 'undefined') return;

    var nodeStored = void 0;
    var $el = void 0;

    if (typeof node === 'string') {
        return document.createTextNode(
        // use decode only if necessary
        canDecode(node));
    }

    if (node.type[0] === '#') {
        node.type = TAG.EMPTY;
    }

    //console.log(node.type, node.targetDefaultSlot);

    if (node.props && node.props.slot && !node.isNewSlotEl) {
        return document.createComment('slot(' + node.props.slot + ')');
    }

    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    } else {
        $el = node.isSVG ? document.createElementNS(NS.SVG, node.type) : document.createElement(node.type);

        storeElementNode[node.type] = $el.cloneNode(true);
    }

    attach($el, node.props, cmp, cmpParent);

    //console.log($el);

    var _defined2 = node.children;

    var _defined3 = function _defined3(item) {
        return create(item, cmp, initial, cmpParent);
    };

    var _defined = new Array(_defined2.length);

    for (var _i4 = 0; _i4 <= _defined2.length - 1; _i4++) {
        _defined[_i4] = _defined3(_defined2[_i4], _i4, _defined2);
    }

    for (var _i2 = 0; _i2 <= _defined.length - 1; _i2++) {
        $el.appendChild.bind($el)(_defined[_i2], _i2, _defined);
    }

    cmp.$$afterNodeElementCreate($el, node, initial);
    //console.log(cmpParent)

    return $el;
}

function update($parent, newNode, oldNode) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var cmp = arguments[4];
    var initial = arguments[5];
    var cmpParent = arguments[6];


    if (newNode && newNode.cmp) cmp = newNode.cmp;

    if (!$parent) return;

    if (cmpParent && $parent[COMPONENT_INSTANCE]) {

        var result = hooks.callDrawByParent($parent[COMPONENT_INSTANCE], newNode, oldNode);
        if (result !== undefined && result !== null && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
            newNode = result.newNode || newNode;
            oldNode = result.oldNode || oldNode;
        }

        // Slot logic

        var propsSlot = newNode.props ? newNode.props.slot : false;

        if ($parent[COMPONENT_INSTANCE]._defaultSlot && !propsSlot) {
            propsSlot = DEFAULT_SLOT_KEY;
        }

        if ((typeof newNode === 'undefined' ? 'undefined' : _typeof(newNode)) === 'object' && propsSlot && $parent[COMPONENT_INSTANCE]._slots[propsSlot]) {
            var _defined4 = function _defined4($slot) {
                // Slot is on DOM
                if ($slot.parentNode) {
                    newNode.isNewSlotEl = true;
                    var $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
                    $newElement.removeAttribute('slot');
                    // I must replace $slot element with $newElement
                    $slot.parentNode.replaceChild($newElement, $slot);
                    // Assign at $slot a property that referred to $newElement
                    $slot.__newSlotEl = $newElement;
                } else {
                    // Now I must update $slot.__newSlotEl using update function
                    // I need to known the index of newSlotEl in child nodes list of his parent
                    var indexNewSlotEl = Array.from($slot.__newSlotEl.parentNode.children).indexOf($slot.__newSlotEl);

                    update($slot.__newSlotEl.parentNode, newNode, oldNode, indexNewSlotEl, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
                }
            };

            var _defined5 = $parent[COMPONENT_INSTANCE]._slots[propsSlot];

            for (var _i6 = 0; _i6 <= _defined5.length - 1; _i6++) {
                _defined4(_defined5[_i6], _i6, _defined5);
            }

            return;
        }
    }

    if (!oldNode) {
        //console.log('create node', $parent);
        // create node

        var $newElement = void 0;

        if ($parent.childNodes.length) {
            // If last node is a root, insert before
            var $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
            if ($lastNode[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
                $parent.insertBefore($newElement, $lastNode);
                //console.log('$newElement', $newElement)
                return $newElement;
            }
        }
        $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
        $parent.appendChild($newElement);
        //console.log('$newElement', $newElement[COMPONENT_ROOT_INSTANCE])
        return $newElement;
    } else if (!newNode) {
        //console.log('remove node', $parent);
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    } else if (isChanged(newNode, oldNode)) {
        //console.log('node changes', $parent);
        // node changes
        var $oldElement = $parent.childNodes[index];
        if (!$oldElement) return;
        var canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement) return canReuseElement;

        var _$newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);

        $parent.replaceChild(_$newElement, $oldElement);

        cmp.$$afterNodeChange(_$newElement, $oldElement);

        return _$newElement;
    } else if (newNode.type) {
        // walk node
        /*
        Adjust index so it's possible update props in nested component like:
          <parent-component>
            <child-component>
                ${this.props.foo}
            </child-component>
            <child-component>
                ${this.props.bar}
            </child-component>
        </parent-component>
        */
        if ($parent[COMPONENT_INSTANCE] === cmp && $parent.childNodes.length) {
            // subtract 1 (should be dz-root) to child nodes length
            // check if last child node is a root of the component
            var lastIndex = $parent.childNodes.length - 1;
            if ($parent.childNodes[lastIndex][COMPONENT_ROOT_INSTANCE]) index += lastIndex;
        }

        var attributesUpdated = updateAttributes($parent.childNodes[index], newNode.props, oldNode.props, cmp, $parent[COMPONENT_INSTANCE] || cmpParent);

        if (cmp.$$beforeNodeWalk($parent, index, attributesUpdated)) return;

        var newLength = newNode.children.length;
        var oldLength = oldNode.children.length;

        for (var i = 0; i < newLength || i < oldLength; i++) {
            update($parent.childNodes[index], newNode.children[i], oldNode.children[i], i, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html = __webpack_require__(10);

function canDecode(str) {
    return (/&\w+;/.test(str) ? html.decode(str) : str
    );
}

module.exports = canDecode;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(1),
    TAG = _require.TAG;

var tag = TAG.TEXT_NODE_PLACE;
var LESSER = '<';
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
        var _defined = function _defined(char) {
            if (char === LESSER) allowTag = false;
            if (char === GREATER) allowTag = true;
        };

        var _defined2 = [].concat(_toConsumableArray(strings[i]));

        for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
            _defined(_defined2[_i2], _i2, _defined2);
        }

        if (/<\/?style>/ig.test(strings[i])) allowTag = false;

        if (allowTag) result += '<' + tag + '>' + value[i] + '</' + tag + '>' + strings[i + 1];else result += '' + value[i] + strings[i + 1];
    }

    result = result.replace(regOpen, LESSER).replace(regClose, GREATER);

    return result;
};

/***/ }),
/* 17 */
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
            } else {
                console.warn('Doz', 'mixin failed for already defined property: ' + index);
            }
        }
    }

    return target;
}

module.exports = mixin;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var manipulate = __webpack_require__(13);

function propsInit(instance) {

    (function iterate(props) {
        var keys = Object.keys(props);
        for (var i = 0, l = keys.length; i < l; i++) {
            var property = keys[i];
            if (props[property] instanceof Object && props[property] !== null) {
                iterate(props[property]);
            } else {
                props[property] = manipulate(instance, props[property], property, false, true);
            }
        }
    })(instance._rawProps);
}

module.exports = propsInit;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function toLiteralString(str) {
    return str.replace(/{{/gm, '${').replace(/}}/gm, '}');
}

module.exports = toLiteralString;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
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
    var _defined = function _defined(func) {
        func(app.constructor, app, func.options);
    };

    var _defined2 = data.plugins;

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }
}

module.exports = {
    use: use,
    load: load
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(22);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Doz = __webpack_require__(23);
var collection = __webpack_require__(2);

var _require = __webpack_require__(20),
    use = _require.use;

var _require2 = __webpack_require__(0),
    directive = _require2.directive;

var component = __webpack_require__(55);
var Component = __webpack_require__(8);
var mixin = __webpack_require__(56);
var h = __webpack_require__(16);

var _require3 = __webpack_require__(5),
    compile = _require3.compile;

var _require4 = __webpack_require__(14),
    update = _require4.update;

__webpack_require__(57);

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
    update: {
        value: update,
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
    directive: {
        value: directive,
        enumerable: true
    },
    version: {
        value: '1.25.0',
        enumerable: true
    }
});

module.exports = Doz;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bind = __webpack_require__(24);
var instances = __webpack_require__(9);

var _require = __webpack_require__(1),
    TAG = _require.TAG,
    REGEX = _require.REGEX;

var toLiteralString = __webpack_require__(19);
var plugin = __webpack_require__(20);
var directive = __webpack_require__(0);

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

        this.cfg = Object.assign({}, {
            components: [],
            shared: {},
            propsListener: null,
            propsListenerAsync: null,
            actions: {},
            autoDraw: true,
            enableExternalTemplate: false
        }, cfg);

        Object.defineProperties(this, {
            _lastUId: {
                value: 0,
                writable: true
            },
            /*_componentsByUId: {
                value: {},
                writable: true
            },*/
            _components: {
                value: {},
                writable: true
            },
            _usedComponents: {
                value: {},
                writable: true
            },
            /*_stores: {
                value: {},
                writable: true
            },*/
            _cache: {
                value: new Map()
            },
            /*_ids: {
                value: {},
                writable: true
            },*/
            _onAppReadyCB: {
                value: [],
                writable: true
            },
            _callAppReady: {
                value: function value() {
                    var _defined = function _defined(cb) {
                        if (typeof cb === 'function' && cb._instance) {
                            cb.call(cb._instance);
                        }
                    };

                    var _defined2 = this._onAppReadyCB;

                    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
                        _defined(_defined2[_i2], _i2, _defined2);
                    }

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
            shared: {
                value: this.cfg.shared,
                writable: true,
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

                    var contentStr = this.cfg.enableExternalTemplate ? eval('`' + toLiteralString(template) + '`') : template;
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
            var _defined3 = function _defined3(cmp) {
                if ((typeof cmp === 'undefined' ? 'undefined' : _typeof(cmp)) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
                    _this._components[cmp.tag] = cmp;
                }
            };

            var _defined4 = this.cfg.components;

            for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
                _defined3(_defined4[_i4], _i4, _defined4);
            }
        } else if (_typeof(this.cfg.components) === 'object') {
            var _defined5 = function _defined5(objName) {
                _this._components[objName] = {
                    tag: objName,
                    cfg: _this.cfg.components[objName]
                };
            };

            var _defined6 = Object.keys(this.cfg.components);

            for (var _i6 = 0; _i6 <= _defined6.length - 1; _i6++) {
                _defined5(_defined6[_i6], _i6, _defined6);
            }
        }

        this._components[TAG.APP] = {
            tag: TAG.APP,
            cfg: {
                template: typeof cfg.template === 'function' ? cfg.template : function () {
                    var contentStr = toLiteralString(cfg.template);
                    if (/\${.*?}/g.test(contentStr)) return eval('`' + contentStr + '`');else return contentStr;
                }
            }
        };

        var _defined7 = function _defined7(p) {
            if (!['template', 'root'].includes(p)) _this._components[TAG.APP].cfg[p] = cfg[p];
        };

        var _defined8 = Object.keys(cfg);

        for (var _i8 = 0; _i8 <= _defined8.length - 1; _i8++) {
            _defined7(_defined8[_i8], _i8, _defined8);
        }

        plugin.load(this);
        directive.callAppInit(this);

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
            }); // || [];

            return this;
        }
    }, {
        key: 'on',


        /*
        getComponent(alias) {
            return this._tree
                ? this._tree.children[alias]
                : undefined;
        }*/
        /*
        getComponentById(id) {
            return this._ids[id];
        }
        */
        /*getStore(store) {
            return this._stores[store];
        }*/

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

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (this._onAppCB[event]) {
                var _defined9 = function _defined9(func) {
                    func.apply(_this2, args);
                };

                var _defined10 = this._onAppCB[event];

                for (var _i10 = 0; _i10 <= _defined10.length - 1; _i10++) {
                    _defined9(_defined10[_i10], _i10, _defined10);
                }
            }

            return this;
        }
    }, {
        key: 'generateUId',
        value: function generateUId() {
            return ++this._lastUId;
        }
    }, {
        key: 'mainComponent',
        get: function get() {
            return this._tree;
        }
    }]);

    return Doz;
}();

module.exports = Doz;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function bind(obj, context) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj == null) {
        throw new TypeError('expected an object!');
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var composeStyleInner = __webpack_require__(11);
var createStyle = __webpack_require__(26);

function scopedInner(cssContent, uId, tag) {
    if (typeof cssContent !== 'string') return;
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, uId);
}

module.exports = {
    scopedInner: scopedInner
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function createStyle(cssContent, uId) {
    var result = void 0;
    var styleId = uId + '--style';
    var styleExists = document.getElementById(styleId);

    if (styleExists) {
        result = styleExists.innerHTML = cssContent;
    } else {
        var styleEl = document.createElement('style');
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        document.head.appendChild(styleEl);
    }

    return result;
}

module.exports = createStyle;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    components: {},
    plugins: [],
    directives: {}
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(2),
    data = _require.data;

// All methods that starts with prefix callApp are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id

function callMethod() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var method = args.shift();
    var oKeys = Object.keys(data.directives);
    var callback = void 0;

    // Search for a possible callback
    for (var i = 0; i < args.length; i++) {
        if (typeof args[i] === 'function') {
            callback = args[i];
            break;
        }
    }

    for (var _i = 0; _i < oKeys.length; _i++) {
        var key = oKeys[_i];
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            var res = data.directives[key][method].apply(data.directives[key], args);
            // If res returns something, fire the callback
            if (res !== undefined && callback) callback(res);
        }
    }
}

function callAppInit() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    args = ['onAppInit'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentCreate() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    args = ['onAppComponentCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentBeforeCreate() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    args = ['onAppComponentBeforeCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentConfigCreate() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    args = ['onAppComponentConfigCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentBeforeMount() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
    }

    args = ['onAppComponentBeforeMount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentMount() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
    }

    args = ['onAppComponentMount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentMountAsync() {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
    }

    args = ['onAppComponentMountAsync'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentBeforeUpdate() {
    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
    }

    args = ['onAppComponentBeforeUpdate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentUpdate() {
    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
    }

    args = ['onAppComponentUpdate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentDrawByParent() {
    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
    }

    args = ['onAppComponentDrawByParent'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentAfterRender() {
    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
    }

    args = ['onAppComponentAfterRender'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentBeforeUnmount() {
    for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
    }

    args = ['onAppComponentBeforeUnmount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentUnmount() {
    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
    }

    args = ['onAppComponentUnmount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentBeforeDestroy() {
    for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
    }

    args = ['onAppComponentBeforeDestroy'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentSetConfig() {
    for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
    }

    args = ['onAppComponentSetConfig'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentSetProps() {
    for (var _len17 = arguments.length, args = Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
    }

    args = ['onAppComponentSetProps'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentLoadProps() {
    for (var _len18 = arguments.length, args = Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
    }

    args = ['onAppComponentLoadProps'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentDestroy() {
    for (var _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
    }

    args = ['onAppComponentDestroy'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentAssignIndex() {
    for (var _len20 = arguments.length, args = Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
    }

    args = ['onAppComponentAssignIndex'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppWalkDOM() {
    for (var _len21 = arguments.length, args = Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
    }

    args = ['onAppWalkDOM'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentAssignName() {
    for (var _len22 = arguments.length, args = Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
    }

    args = ['onAppComponentAssignName'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentPropsAssignName() {
    for (var _len23 = arguments.length, args = Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
    }

    args = ['onAppComponentPropsAssignName'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppDOMElementCreate() {
    for (var _len24 = arguments.length, args = Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
    }

    //todo Dovrebbe risolvere il problema del tag doppio
    args = ['onAppDOMElementCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppDynamicInstanceCreate() {
    for (var _len25 = arguments.length, args = Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
        args[_key25] = arguments[_key25];
    }

    args = ['onAppDynamicInstanceCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callAppComponentRenderOverwrite() {
    for (var _len26 = arguments.length, args = Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
        args[_key26] = arguments[_key26];
    }

    args = ['onAppComponentRenderOverwrite'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

/*function callAppDOMAttributeSet(...args) {
    args = ['onAppDOMAttributeSet', ...args];
    callMethod.apply(null, args);
}*/

module.exports = {
    callAppInit: callAppInit,
    callAppComponentCreate: callAppComponentCreate,
    callAppComponentLoadProps: callAppComponentLoadProps,
    callAppComponentSetConfig: callAppComponentSetConfig,
    callAppComponentSetProps: callAppComponentSetProps,
    callAppComponentDestroy: callAppComponentDestroy,
    callAppComponentAssignIndex: callAppComponentAssignIndex,
    callAppComponentBeforeCreate: callAppComponentBeforeCreate,
    callAppComponentConfigCreate: callAppComponentConfigCreate,
    callAppComponentBeforeMount: callAppComponentBeforeMount,
    callAppComponentMount: callAppComponentMount,
    callAppComponentBeforeDestroy: callAppComponentBeforeDestroy,
    callAppComponentUnmount: callAppComponentUnmount,
    callAppComponentBeforeUnmount: callAppComponentBeforeUnmount,
    callAppComponentAfterRender: callAppComponentAfterRender,
    callAppComponentDrawByParent: callAppComponentDrawByParent,
    callAppComponentUpdate: callAppComponentUpdate,
    callAppComponentBeforeUpdate: callAppComponentBeforeUpdate,
    callAppComponentMountAsync: callAppComponentMountAsync,
    callAppWalkDOM: callAppWalkDOM,
    callAppComponentAssignName: callAppComponentAssignName,
    callAppDOMElementCreate: callAppDOMElementCreate,
    callAppDynamicInstanceCreate: callAppDynamicInstanceCreate,
    callAppComponentPropsAssignName: callAppComponentPropsAssignName,
    callAppComponentRenderOverwrite: callAppComponentRenderOverwrite
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(2),
    data = _require.data;

var _require2 = __webpack_require__(30),
    extractDirectivesFromProps = _require2.extractDirectivesFromProps,
    isDirective = _require2.isDirective;

var _require3 = __webpack_require__(1),
    REGEX = _require3.REGEX;

// Hooks for the component


function callMethod() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var method = args[0];
    var cmp = args[1];

    // Remove first argument event name
    args.shift();
    //console.warn(cmp.tag, method, cmp.props)

    var directivesKeyValue = extractDirectivesFromProps(cmp);

    var _defined = function _defined(key) {

        var keyArgumentsValues = [];
        var keyArguments = {};
        var originKey = key;

        if (key.indexOf('-') !== -1) {
            keyArgumentsValues = key.split('-');
            key = keyArgumentsValues[0];
            keyArgumentsValues.shift();
        }

        var directiveObj = data.directives[key];
        //console.log(method, directiveObj)
        //if (directiveObj)
        //console.warn(method, directiveObj[method])
        if (directiveObj && typeof directiveObj[method] === 'function') {
            // Clone args object
            var outArgs = Object.assign([], args);
            // Add directive value
            outArgs.push(directivesKeyValue[originKey]);

            var _defined3 = function _defined3(keyArg, i) {
                return keyArguments[keyArg] = keyArgumentsValues[i];
            };

            var _defined4 = directiveObj._keyArguments;

            for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
                _defined3(_defined4[_i4], _i4, _defined4);
            }

            outArgs.push(keyArguments);
            directiveObj[method].apply(directiveObj, outArgs);
        }
    };

    var _defined2 = Object.keys(directivesKeyValue);

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }
}

function callComponentBeforeCreate() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    args = ['onComponentBeforeCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentCreate() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    args = ['onComponentCreate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentBeforeMount() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    args = ['onComponentBeforeMount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentMount() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    args = ['onComponentMount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentMountAsync() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
    }

    args = ['onComponentMountAsync'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentAfterRender() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
    }

    args = ['onComponentAfterRender'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentBeforeUpdate() {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
    }

    args = ['onComponentBeforeUpdate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentUpdate() {
    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
    }

    args = ['onComponentUpdate'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentBeforeUnmount() {
    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
    }

    args = ['onComponentBeforeUnmount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentUnmount() {
    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
    }

    args = ['onComponentUnmount'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentBeforeDestroy() {
    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
    }

    args = ['onComponentBeforeDestroy'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentDestroy() {
    for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
    }

    args = ['onComponentDestroy'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentLoadProps() {
    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
    }

    args = ['onComponentLoadProps'].concat(_toConsumableArray(args));
    callMethod.apply(null, args);
}

function callComponentDOMElementCreate(instance, $target, initial) {
    var method = 'onComponentDOMElementCreate';
    var attributes = Array.from($target.attributes);

    var _defined5 = function _defined5(attribute) {
        if (isDirective(attribute.name)) {
            var directiveName = attribute.name.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            var directiveValue = attribute.value;
            var directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                $target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial]);
            }
        }
    };

    for (var _i6 = 0; _i6 <= attributes.length - 1; _i6++) {
        _defined5(attributes[_i6], _i6, attributes);
    }
}

function callComponentDOMElementUpdate(instance, $target) {
    var method = 'onComponentDOMElementUpdate';
    var attributes = Array.from($target.attributes);

    var _defined6 = function _defined6(attribute) {
        if (isDirective(attribute.name)) {
            var directiveName = attribute.name.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            var directiveValue = attribute.value;
            var directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue]);
            }
        }
    };

    for (var _i8 = 0; _i8 <= attributes.length - 1; _i8++) {
        _defined6(attributes[_i8], _i8, attributes);
    }
}

module.exports = {
    callComponentBeforeCreate: callComponentBeforeCreate,
    callComponentCreate: callComponentCreate,
    callComponentBeforeMount: callComponentBeforeMount,
    callComponentMount: callComponentMount,
    callComponentMountAsync: callComponentMountAsync,
    callComponentAfterRender: callComponentAfterRender,
    callComponentBeforeUpdate: callComponentBeforeUpdate,
    callComponentUpdate: callComponentUpdate,
    callComponentBeforeUnmount: callComponentBeforeUnmount,
    callComponentUnmount: callComponentUnmount,
    callComponentBeforeDestroy: callComponentBeforeDestroy,
    callComponentDestroy: callComponentDestroy,
    callComponentLoadProps: callComponentLoadProps,
    callComponentDOMElementCreate: callComponentDOMElementCreate,
    callComponentDOMElementUpdate: callComponentDOMElementUpdate
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    REGEX = _require.REGEX;

function extractDirectivesFromProps(cmp) {
    //let canBeDeleteProps = true;
    var props = void 0;

    if (!Object.keys(cmp.props).length) {
        props = cmp._rawProps;
        //canBeDeleteProps = false;
    } else {
        props = cmp.props;
    }

    var _defined
    /*if (canBeDeleteProps)
        delete props[key];*/
    = function _defined(key) {
        if (isDirective(key)) {
            var keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            cmp._directiveProps[keyWithoutD] = props[key];
        }
    };

    var _defined2 = Object.keys(props);

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }

    return cmp._directiveProps;
}

function isDirective(name) {
    return REGEX.IS_DIRECTIVE.test(name);
}

module.exports = {
    isDirective: isDirective,
    extractDirectivesFromProps: extractDirectivesFromProps
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isJSON(obj) {
    return (/^[{\[]/.test(obj)
    );
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isNumber(obj) {
    if (/^0{2,}/.test(obj)) return false;
    return (/^[0-9]/.test(obj)
    );
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toJSON(obj) {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toNumber(obj) {
    var num = parseFloat(obj);
    if (!isNaN(num)) {
        if (isFinite(obj)) {
            if (obj.toLowerCase().indexOf('0x') === 0) {
                return parseInt(obj, 16);
            }
            return num;
        }
    }
    return obj;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    'undefined': undefined,
    'null': null,
    'NaN': NaN,
    'Infinity': Infinity,
    'true': true,
    'false': false
};

/***/ }),
/* 36 */
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

    var _defined = function _defined(p) {
        if (instance._initialProps[p] === window[NS_INIT_PROPS][id].get(p)) instance.props[p] = window[NS_PROPS][id].get(p) || instance.props[p];else instance.props[p] = instance._initialProps[p];
    };

    var _defined2 = Object.keys(instance.props);

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }

    _module.hot.dispose(function () {
        var _defined3 = function _defined3(p) {
            window[NS_PROPS][id].set(p, instance.props[p]);
            window[NS_INIT_PROPS][id].set(p, instance._initialProps[p]);
        };

        var _defined4 = Object.keys(instance.props);

        for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
            _defined3(_defined4[_i4], _i4, _defined4);
        }
    });
}

module.exports = hmr;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var proxy = __webpack_require__(12);
var events = __webpack_require__(4);
//const {updateBoundElementsByChanges} = require('./update-bound-element');
var propsListener = __webpack_require__(38);
var manipulate = __webpack_require__(13);

function runUpdate(instance, changes) {
    events.callUpdate(instance, changes);
    propsListener(instance, changes);
    instance.render(undefined, changes);
    //updateBoundElementsByChanges(instance, changes);
}

function create(instance) {

    var recreate = false;

    if (instance._props && instance._props.__isProxy) {
        proxy.remove(instance._props);
        recreate = true;
    }

    instance._props = proxy.create(instance._rawProps, true, function (changes) {
        if (!instance._isRendered) return;

        if (instance.delayUpdate) {
            setTimeout(function () {
                runUpdate(instance, changes);
            }, instance.delayUpdate);
        } else {
            runUpdate(instance, changes);
        }
    }, function (target, property) {
        target[property] = manipulate(instance, target[property], property);
    });

    proxy.manipulate(instance._props, function (value, currentPath, onFly) {
        return manipulate(instance, value, currentPath, onFly);
    });

    proxy.beforeChange(instance._props, function (changes) {
        var res = events.callBeforeUpdate(instance, changes);
        if (res === false) return false;
    });

    if (recreate && instance._isRendered) {
        instance.render();
    }
}

module.exports = {
    create: create
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var delay = __webpack_require__(3);

function propsListener(instance, changes) {

    if (_typeof(instance.propsListener) === 'object') for (var i = 0; i < changes.length; i++) {
        var item = changes[i];
        var propPath = instance.propsListener[item.currentPath];
        if (item.type === 'update' && propPath) {
            var func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                func.call(instance, item.newValue, item.previousValue);
            }
        }
    }

    if (_typeof(instance.propsListenerAsync) === 'object') for (var _i = 0; _i < changes.length; _i++) {
        var _item = changes[_i];
        var _propPath = instance.propsListenerAsync[_item.currentPath];
        if (_item.type === 'update' && _propPath) {
            (function () {
                var func = instance[_propPath] || _propPath;
                if (typeof func === 'function') {
                    (function (item) {
                        delay(function () {
                            return func.call(instance, item.newValue, item.previousValue);
                        });
                    })(_item);
                }
            })();
        }
    }
}

module.exports = propsListener;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var types = {
    string: function string(value) {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    },
    number: function number(value) {
        if (typeof value === 'number') return value;
        return Number(value);
    },
    boolean: function boolean(value) {
        if (typeof value === 'boolean') return value;else if (value === 'true' || value === 1) return true;else if (value === 'false' || value === 0) return false;else {
            return !!value;
        }
    },
    object: function object(value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) return value;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },
    array: function array(value) {
        return this.object(value);
    },
    date: function date(value) {
        if (value instanceof Date) return value;else return new Date(value);
    }
};

module.exports = function castType(value, type) {
    if (types[type] !== undefined) {
        value = types[type](value);
    }
    return value;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var element = __webpack_require__(14);

module.exports = {
    updateElement: element.update
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(1),
    REGEX = _require.REGEX,
    ATTR = _require.ATTR;

var castStringTo = __webpack_require__(6);
var objectPath = __webpack_require__(42);

function isEventAttribute(name) {
    return REGEX.IS_LISTENER.test(name);
}

function setAttribute($target, name, value, cmp) {

    if (isCustomAttribute(name)) {} else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        try {
            $target.setAttribute(name, JSON.stringify(value));
        } catch (e) {}
    } else {
        if (value === undefined) value = '';
        $target.setAttribute(name, value);
    }
}

function removeAttribute($target, name, cmp) {
    if (isCustomAttribute(name) || !$target) {} else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal, cmp) {
    if (newVal === '') {
        removeAttribute($target, name, cmp);
        cmp.$$afterAttributeUpdate($target, name, newVal);
    } else if (oldVal === '' || newVal !== oldVal) {
        setAttribute($target, name, newVal, cmp);
        cmp.$$afterAttributeUpdate($target, name, newVal);
    }
}

function updateAttributes($target, newProps) {
    var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cmp = arguments[3];
    var cmpParent = arguments[4];

    var props = Object.assign({}, newProps, oldProps);
    var updated = [];

    var _defined = function _defined(name) {
        if (!$target || $target.nodeType !== 1) return;
        updateAttribute($target, name, newProps[name], oldProps[name], cmp, cmpParent);
        if (newProps[name] !== oldProps[name]) {
            var obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    };

    var _defined2 = Object.keys(props);

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }

    return updated;
}

function isCustomAttribute(name) {
    return isEventAttribute(name) || name === ATTR.FORCE_UPDATE;
}

function setBooleanAttribute($target, name, value) {
    $target.setAttribute(name, value);
    $target[name] = value;
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function trimQuotes(str) {
    return str.replace(REGEX.TRIM_QUOTES, '$1');
}

function addEventListener($target, name, value, cmp, cmpParent) {

    if (!isEventAttribute(name)) return;

    // If use scope. from onDrawByParent event
    var match = value.match(REGEX.GET_LISTENER_SCOPE);

    if (match) {

        var args = null;
        var handler = match[1];
        var stringArgs = match[2];
        if (stringArgs) {
            var _defined3 = stringArgs.split(',');

            args = new Array(_defined3.length);

            var _defined4 = function _defined4(item) {
                item = item.trim();
                return item === 'scope' ? cmpParent : castStringTo(trimQuotes(item));
            };

            for (var _i4 = 0; _i4 <= _defined3.length - 1; _i4++) {
                args[_i4] = _defined4(_defined3[_i4], _i4, _defined3);
            }
        }

        var method = objectPath(handler, cmpParent);
        if (method !== undefined) {
            value = args ? method.bind.apply(method, [cmpParent].concat(_toConsumableArray(args))) : method.bind(cmpParent);
        }
    } else {

        match = value.match(REGEX.GET_LISTENER);

        if (match) {
            var _args = null;
            var _handler = match[1];
            var _stringArgs = match[2];
            if (_stringArgs) {
                var _defined5 = _stringArgs.split(',');

                _args = new Array(_defined5.length);

                var _defined6 = function _defined6(item) {
                    item = item.trim();
                    return item === 'this' ? cmp : castStringTo(trimQuotes(item));
                };

                for (var _i6 = 0; _i6 <= _defined5.length - 1; _i6++) {
                    _args[_i6] = _defined6(_defined5[_i6], _i6, _defined5);
                }
            }

            var isParentMethod = _handler.match(REGEX.IS_PARENT_METHOD);

            if (isParentMethod) {
                _handler = isParentMethod[1];
                cmp = cmp.parent;
            }

            var _method = objectPath(_handler, cmp);

            if (_method !== undefined) {
                value = _args ? _method.bind.apply(_method, [cmp].concat(_toConsumableArray(_args))) : _method.bind(cmp);
            }
        }
    }

    if (typeof value === 'function') $target.addEventListener(extractEventName(name), value);else {
        value = value.replace(REGEX.THIS_TARGET, '$target');
        // I don't understand but with regex test sometimes it don't works fine so use match... boh!
        //if (REGEX.IS_LISTENER_SCOPE.test(value) || value === 'scope') {
        if (value.match(REGEX.IS_LISTENER_SCOPE) || value === 'scope') {
            var _func = function _func() {
                // Brutal replace of scope with this
                value = value.replace(/scope/g, 'this');
                eval(value);
            };
            $target.addEventListener(extractEventName(name), _func.bind(cmpParent));
        } else {
            var _func2 = function _func2() {
                eval(value);
            };
            $target.addEventListener(extractEventName(name), _func2.bind(cmp));
        }
    }
}

function attach($target, nodeProps, cmp, cmpParent) {

    var bindValue = void 0;
    var name = void 0;

    var propsKeys = Object.keys(nodeProps);

    for (var i = 0, len = propsKeys.length; i < len; i++) {
        name = propsKeys[i];
        setAttribute($target, name, nodeProps[name], cmp, cmpParent);
        addEventListener($target, name, nodeProps[name], cmp, cmpParent);
        cmp.$$afterAttributeCreate($target, name, nodeProps[name], nodeProps);
    }

    var datasetArray = Object.keys($target.dataset);
    for (var _i7 = 0; _i7 < datasetArray.length; _i7++) {
        if (REGEX.IS_LISTENER.test(datasetArray[_i7])) addEventListener($target, _i7, $target.dataset[datasetArray[_i7]], cmp, cmpParent);
    }

    //cmp.$$afterAttributesCreate($target, bindValue);
}

module.exports = {
    attach: attach,
    updateAttributes: updateAttributes
};

/***/ }),
/* 42 */
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    COMPONENT_DYNAMIC_INSTANCE = _require.COMPONENT_DYNAMIC_INSTANCE;

var directive = __webpack_require__(0);

function drawDynamic(instance) {

    var index = instance._processing.length - 1;

    while (index >= 0) {
        var item = instance._processing[index];
        var root = item.node.parentNode;

        var dynamicInstance = __webpack_require__(9).get({
            root: root,
            template: item.node.outerHTML,
            app: instance.app,
            parent: instance
        });

        if (dynamicInstance) {

            // Replace with dynamic instance original node
            //console.log('....', item.node.outerHTML, dynamicInstance._rootElement.parentNode.outerHTML)
            root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);

            // if original node has children
            if (item.node.childNodes.length) {
                // replace again -.-
                root.replaceChild(item.node, dynamicInstance._rootElement.parentNode);
                // and append root element of dynamic instance :D
                item.node.appendChild(dynamicInstance._rootElement);
            }

            dynamicInstance._rootElement.parentNode[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
            instance._processing.splice(index, 1);
            var n = Object.keys(instance.children).length;
            instance.children[n++] = dynamicInstance;

            if (instance.childrenByTag[dynamicInstance.tag] === undefined) {
                instance.childrenByTag[dynamicInstance.tag] = [dynamicInstance];
            } else {
                instance.childrenByTag[dynamicInstance.tag].push(dynamicInstance);
            }

            directive.callAppDynamicInstanceCreate(instance, dynamicInstance, item);
        }
        index -= 1;
    }
}

module.exports = drawDynamic;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var camelToDash = __webpack_require__(45);

function toInlineStyle(obj) {
    var withStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var _defined = Object.entries(obj);

    var _defined2 = function _defined2(styleString, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            propName = _ref2[0],
            propValue = _ref2[1];

        return '' + styleString + camelToDash(propName) + ':' + propValue + ';';
    };

    var _acc = '';

    for (var _i2 = 0; _i2 <= _defined.length - 1; _i2++) {
        _acc = _defined2(_acc, _defined[_i2], _i2, _defined);
    }

    obj = _acc;

    return withStyle ? 'style="' + obj + '"' : obj;
}

module.exports = toInlineStyle;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function camelToDash(s) {
    return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

module.exports = camelToDash;

/***/ }),
/* 46 */
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function add(instance) {
    if (typeof instance.onAppDraw === 'function') {
        instance.onAppDraw._instance = instance;
        instance.app._onAppDrawCB.push(instance.onAppDraw);
    }
}

function emit(instance, next, prev) {
    var _defined = function _defined(cb) {
        if (typeof cb === 'function' && cb._instance) {
            cb.call(cb._instance, next, prev, instance);
        }
    };

    var _defined2 = instance.app._onAppDrawCB;

    for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
        _defined(_defined2[_i2], _i2, _defined2);
    }
}

module.exports = {
    add: add,
    emit: emit
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);
}

module.exports = extendInstance;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function removeAllAttributes(el) {
    var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var attributeName = void 0;
    for (var i = el.attributes.length - 1; i >= 0; i--) {
        attributeName = el.attributes[i].name;
        // exclude anyway data attributes
        if (exclude.includes(attributeName) || attributeName.split('-')[0] === 'data') continue;
        el.removeAttribute(attributeName);
    }
}

module.exports = removeAllAttributes;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function loadLocal(instance) {

    // Add local components
    if (Array.isArray(instance.components)) {
        var _defined = function _defined(cmp) {
            if ((typeof cmp === 'undefined' ? 'undefined' : _typeof(cmp)) === 'object' && typeof cmp.tag === 'string' && _typeof(cmp.cfg) === 'object') {
                instance._components[cmp.tag] = cmp;
            }
        };

        var _defined2 = instance.components;

        for (var _i2 = 0; _i2 <= _defined2.length - 1; _i2++) {
            _defined(_defined2[_i2], _i2, _defined2);
        }

        delete instance.components;
    } else if (_typeof(instance.components) === 'object') {
        var _defined3 = function _defined3(objName) {
            instance._components[objName] = {
                tag: objName,
                cfg: instance.components[objName]
            };
        };

        var _defined4 = Object.keys(instance.components);

        for (var _i4 = 0; _i4 <= _defined4.length - 1; _i4++) {
            _defined3(_defined4[_i4], _i4, _defined4);
        }

        delete instance.components;
    }
}

module.exports = loadLocal;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mixin = __webpack_require__(17);

function localMixin(instance) {
    mixin(instance, instance.mixin);
    instance.mixin = [];
}

module.exports = localMixin;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var canDecode = __webpack_require__(15);
var composeStyleInner = __webpack_require__(11);
var dashToCamel = __webpack_require__(7);
var Base = __webpack_require__(53);

var _require = __webpack_require__(1),
    COMPONENT_DYNAMIC_INSTANCE = _require.COMPONENT_DYNAMIC_INSTANCE,
    COMPONENT_ROOT_INSTANCE = _require.COMPONENT_ROOT_INSTANCE,
    COMPONENT_INSTANCE = _require.COMPONENT_INSTANCE,
    REGEX = _require.REGEX,
    DEFAULT_SLOT_KEY = _require.DEFAULT_SLOT_KEY,
    TAG = _require.TAG;

var directive = __webpack_require__(0);

var DOMManipulation = function (_Base) {
    _inherits(DOMManipulation, _Base);

    function DOMManipulation(opt) {
        _classCallCheck(this, DOMManipulation);

        return _possibleConstructorReturn(this, (DOMManipulation.__proto__ || Object.getPrototypeOf(DOMManipulation)).call(this, opt));
    }

    _createClass(DOMManipulation, [{
        key: '$$afterNodeElementCreate',
        value: function $$afterNodeElementCreate($el, node, initial) {
            directive.callAppDOMElementCreate(this, $el, node, initial);
            directive.callComponentDOMElementCreate(this, $el, initial);

            if (typeof $el.hasAttribute === 'function') {
                if (node.type.indexOf('-') !== -1 && !initial) {
                    this._processing.push({ node: $el, action: 'create' });
                }

                if ($el.nodeName === TAG.SLOT_UPPERCASE) {
                    var slotName = $el.getAttribute('name');

                    if (!slotName) {
                        this._defaultSlot = $el;
                        slotName = DEFAULT_SLOT_KEY;
                    }

                    if (this._slots[slotName] === undefined) {
                        this._slots[slotName] = [$el];
                    } else {
                        this._slots[slotName].push($el);
                    }
                }
            }
        }

        // noinspection JSMethodCanBeStatic

    }, {
        key: '$$beforeNodeChange',
        value: function $$beforeNodeChange($parent, $oldElement, newNode, oldNode) {
            if (typeof newNode === 'string' && typeof oldNode === 'string' && $oldElement) {
                $oldElement.textContent = canDecode(newNode);
                if ($parent.nodeName === 'SCRIPT') {
                    // it could be heavy
                    if ($parent.type === 'text/style' && $parent.dataset.id && $parent.dataset.owner) {
                        document.getElementById($parent.dataset.id).textContent = composeStyleInner($oldElement.textContent, $parent.dataset.ownerByData);
                    }
                }
                return $oldElement;
            }
        }
    }, {
        key: '$$afterNodeChange',


        // noinspection JSMethodCanBeStatic
        value: function $$afterNodeChange($newElement, $oldElement) {
            //Re-assign CMP COMPONENT_DYNAMIC_INSTANCE to new element
            if ($oldElement[COMPONENT_ROOT_INSTANCE]) {
                $newElement[COMPONENT_ROOT_INSTANCE] = $oldElement[COMPONENT_ROOT_INSTANCE];
                $newElement[COMPONENT_ROOT_INSTANCE]._rootElement = $newElement;
                $newElement[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid = $oldElement[COMPONENT_ROOT_INSTANCE].uId;
            }
        }
    }, {
        key: '$$beforeNodeWalk',


        // noinspection JSMethodCanBeStatic
        value: function $$beforeNodeWalk($parent, index, attributesUpdated) {
            if ($parent.childNodes[index]) {
                var dynInstance = $parent.childNodes[index][COMPONENT_DYNAMIC_INSTANCE];
                // Can update props of dynamic instances?
                if (dynInstance && attributesUpdated.length) {
                    var _defined = function _defined(props) {
                        var _defined2 = function _defined2(name) {
                            dynInstance.props[name] = props[name];
                        };

                        var _defined3 = Object.keys(props);

                        for (var _i4 = 0; _i4 <= _defined3.length - 1; _i4++) {
                            _defined2(_defined3[_i4], _i4, _defined3);
                        }
                    };

                    for (var _i2 = 0; _i2 <= attributesUpdated.length - 1; _i2++) {
                        _defined(attributesUpdated[_i2], _i2, attributesUpdated);
                    }

                    return true;
                }
            }

            return false;
        }

        // noinspection JSMethodCanBeStatic

    }, {
        key: '$$afterAttributeCreate',
        value: function $$afterAttributeCreate($target, name, value, nodeProps) {}

        // noinspection JSMethodCanBeStatic

    }, {
        key: '$$afterAttributesCreate',
        value: function $$afterAttributesCreate($target, bindValue) {}
    }, {
        key: '$$afterAttributeUpdate',
        value: function $$afterAttributeUpdate($target, name, value) {
            if (this.updateChildrenProps && $target) {
                name = REGEX.IS_DIRECTIVE.test(name) ? name : dashToCamel(name);
                var firstChild = $target.firstChild;

                if (firstChild && firstChild[COMPONENT_ROOT_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild[COMPONENT_ROOT_INSTANCE]._publicProps, name)) {
                    firstChild[COMPONENT_ROOT_INSTANCE].props[name] = value;
                } else if ($target[COMPONENT_INSTANCE]) {
                    $target[COMPONENT_INSTANCE].props[name] = value;
                }
            }

            directive.callComponentDOMElementUpdate(this, $target);
            if ($target && REGEX.IS_DIRECTIVE.test(name)) {
                $target.removeAttribute(name);
            }
        }
    }]);

    return DOMManipulation;
}(Base);

module.exports = DOMManipulation;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function Base() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Base);

    opt.cmp = opt.cmp || {
        tag: opt.tag,
        cfg: {}
    };

    opt.app = opt.app || {};

    Object.defineProperties(this, {
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
        _directiveProps: {
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
        _rawHTML: {
            value: '',
            writable: true
        },
        _slots: {
            value: {},
            writable: true
        },
        _defaultSlot: {
            value: null,
            writable: true
        },

        //Public
        tag: {
            value: opt.cmp.tag,
            enumerable: true
        },
        /*uId: {
            value: opt.uId,
            enumerable: true
        },*/
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
};

module.exports = Base;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = cloneObject;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
    registerComponent = _require.registerComponent;

var _require2 = __webpack_require__(1),
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Component = __webpack_require__(8);
var mixin = __webpack_require__(17);

function globalMixin(obj) {
    mixin(Component.prototype, obj);
}

module.exports = globalMixin;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(58);
__webpack_require__(59);
__webpack_require__(60);
__webpack_require__(61);
__webpack_require__(62);

__webpack_require__(63);
__webpack_require__(64);
__webpack_require__(65);
__webpack_require__(66);
__webpack_require__(67);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':store', {
    createStore: function createStore(instance, storeName) {
        if (typeof storeName === 'string') {
            if (instance.app._stores[storeName] !== undefined) {
                throw new Error('Store already defined: ' + storeName);
            }
            instance.app._stores[storeName] = instance.props;
            instance.store = storeName;
        }
    },
    syncStore: function syncStore(instance, storeName) {
        if (typeof storeName === 'string' && instance.app._stores[storeName] !== undefined) {
            instance.app._stores[storeName] = instance.props;
        }
    },
    onAppInit: function onAppInit(app) {
        Object.defineProperties(app, {
            _stores: {
                value: {},
                writable: true
            },
            getStore: {
                value: function value(store) {
                    return app._stores[store];
                },
                enumerable: true
            }
        });
    },


    // Create by property defined
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            getStore: {
                value: function value(store) {
                    return instance.app._stores[store];
                },
                enumerable: true
            }
        });

        if (instance.store !== undefined && instance.props['d:store'] === undefined) {
            this.createStore(instance, instance.store);
        }
    },


    // Create by props
    onComponentCreate: function onComponentCreate(instance, directiveValue) {
        this.createStore(instance, directiveValue);
    },
    onAppComponentLoadProps: function onAppComponentLoadProps(instance) {
        this.syncStore(instance, instance.store);
    },
    onAppComponentSetProps: function onAppComponentSetProps(instance) {
        this.syncStore(instance, instance.store);
    },
    onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
        if (typeof obj.store === 'string') {
            this.createStore(instance, obj.store);
        }
    },
    onAppComponentDestroy: function onAppComponentDestroy(instance) {
        if (instance.store && instance.app._stores[instance.store]) delete instance.app._stores[instance.store];
    }
});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':id', {
    createId: function createId(instance, id) {
        if (typeof id === 'string') {
            if (instance.app._ids[id] !== undefined) {
                throw new Error('ID already defined: ' + id);
            }
            instance.app._ids[id] = instance;
            instance.id = id;
        }
    },
    onAppInit: function onAppInit(app) {
        Object.defineProperties(app, {
            _ids: {
                value: {},
                writable: true
            },
            getComponentById: {
                value: function value(id) {
                    return app._ids[id];
                },
                enumerable: true
            }
        });
    },
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            getComponentById: {
                value: function value(id) {
                    return instance.app._ids[id];
                },
                enumerable: true
            },
            getCmp: {
                value: function value(id) {
                    return instance.app._ids[id];
                },
                enumerable: true
            }
        });

        if (instance.id !== undefined && instance.props['d:id'] === undefined) {
            this.createId(instance, instance.id);
        }
    },
    onComponentCreate: function onComponentCreate(instance, directiveValue) {
        this.createId(instance, directiveValue);
    },
    onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
        if (typeof obj.id === 'string') {
            this.createId(instance, obj.id);
        }
    },
    onAppComponentDestroy: function onAppComponentDestroy(instance) {
        if (instance.id && instance.app._ids[instance.id]) delete instance.app._ids[instance.id];
    }
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':alias', {
    createAlias: function createAlias(instance, alias) {
        if (typeof alias === 'string') {
            instance.alias = alias;
        }
    },
    onAppInit: function onAppInit(app) {
        Object.defineProperties(app, {
            getComponent: {
                value: function value(alias) {
                    return this._tree ? this._tree.children[alias] : undefined;
                },
                enumerable: true
            }
        });
    },
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            getComponent: {
                value: function value(alias) {
                    return this.children ? this.children[alias] : undefined;
                },
                enumerable: true
            }
        });
    },
    onComponentCreate: function onComponentCreate(instance, directiveValue) {
        this.createAlias(instance, directiveValue);
    },
    onAppComponentSetConfig: function onAppComponentSetConfig(instance, obj) {
        if (typeof obj.alias === 'string') {
            this.createAlias(instance, obj.alias);
        }
    },
    onAppComponentAssignIndex: function onAppComponentAssignIndex(instance, n) {
        return instance.alias ? instance.alias : n;
    }
});

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':on-$event', {
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            _callback: {
                value: {},
                writable: true
            },
            emit: {
                value: function value(name) {
                    if (instance._callback && instance._callback[name] !== undefined && instance.parent[instance._callback[name]] !== undefined && typeof instance.parent[instance._callback[name]] === 'function') {
                        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        instance.parent[instance._callback[name]].apply(instance.parent, args);
                    }
                },
                enumerable: true
            }
        });
    },
    onComponentCreate: function onComponentCreate(instance, directiveValue, keyArguments) {
        var source = {};
        source[keyArguments.event] = directiveValue;
        Object.assign(instance._callback, source);
    }
});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive(':onbeforecreate', {
    onComponentBeforeCreate: function onComponentBeforeCreate(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':oncreate', {
    onComponentCreate: function onComponentCreate(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onbeforemount', {
    onComponentBeforeMount: function onComponentBeforeMount(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onmount', {
    onComponentMount: function onComponentMount(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onmountasync', {
    onComponentMountAsync: function onComponentMountAsync(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onafterrender', {
    onComponentAfterRender: function onComponentAfterRender(instance, changes, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onbeforeupdate', {
    onComponentBeforeUpdate: function onComponentBeforeUpdate(instance, changes, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onupdate', {
    onComponentUpdate: function onComponentUpdate(instance, changes, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onbeforeunmount', {
    onComponentBeforeUnmount: function onComponentBeforeUnmount(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onunmount', {
    onComponentUnmount: function onComponentUnmount(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onbeforedestroy', {
    onComponentBeforeDestroy: function onComponentBeforeDestroy(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':ondestroy', {
    onComponentDestroy: function onComponentDestroy(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onloadprops', {
    onComponentLoadProps: function onComponentLoadProps(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive('ref', {
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            ref: {
                value: {},
                writable: true,
                enumerable: true
            }
        });
    },
    onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
        instance.ref[directiveValue] = $target;
    }
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

var dashToCamel = __webpack_require__(7);

directive('is', {
    hasDataIs: function hasDataIs($target) {
        return $target.dataset && $target.dataset.is;
    },
    onAppComponentAssignName: function onAppComponentAssignName(instance, $target) {
        if (this.hasDataIs($target)) return $target.dataset.is;
    },
    onAppComponentPropsAssignName: function onAppComponentPropsAssignName($target, propsName, isDirective) {
        if (this.hasDataIs($target)) return dashToCamel(propsName);
        /*else
            return propsName;*/
    },
    onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
        $target.dataset.is = directiveValue;
        if (!initial) instance._processing.push({ node: $target, action: 'create' });
    }
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    directive = _require.directive;

var castStringTo = __webpack_require__(6);
var delay = __webpack_require__(3);

directive('bind', {

    // Start directive methods

    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            _boundElements: {
                value: {},
                writable: true
            }
        });
    },
    onAppComponentUpdate: function onAppComponentUpdate(instance, changes) {
        this.updateBoundElementsByChanges(instance, changes);
    },
    onAppComponentLoadProps: function onAppComponentLoadProps(instance) {
        this.updateBoundElementsByPropsIteration(instance);
    },
    onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
        if (!this.canBind($target)) return;
        this.setBind(instance, $target, directiveValue);
    },


    // End directive methods
    // Start custom methods

    canBind: function canBind($target) {
        return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1;
    },
    setBind: function setBind(instance, $target, value) {
        var _this2 = this;

        if (instance.props[value] === undefined) return;

        // Add UI events
        var events = ['compositionstart', 'compositionend', 'input', 'change'];

        var _defined = function _defined(event) {
            $target.addEventListener(event, function (e) {
                var _value = void 0;
                if (this.type === 'checkbox') {
                    if (!this.defaultValue) instance.props[value] = this.checked;else {
                        var inputs = document.querySelectorAll('input[name=' + this.name + '][type=checkbox]:checked');

                        var _defined2 = [].concat(_toConsumableArray(inputs));

                        _value = new Array(_defined2.length);

                        var _defined3 = function _defined3(input) {
                            return input.value;
                        };

                        for (var _i4 = 0; _i4 <= _defined2.length - 1; _i4++) {
                            _value[_i4] = _defined3(_defined2[_i4], _i4, _defined2);
                        }

                        instance.props[value] = castStringTo(_value);
                    }
                } else {
                    _value = this.value;
                    if (this.multiple) {
                        var _defined6 = [].concat(_toConsumableArray(this.options));

                        var _defined7 = function _defined7(option) {
                            return option.selected;
                        };

                        var _defined4 = [];

                        for (var _i8 = 0; _i8 <= _defined6.length - 1; _i8++) {
                            if (_defined7(_defined6[_i8], _i8, _defined6)) _defined4.push(_defined6[_i8]);
                        }

                        _value = new Array(_defined4.length);

                        var _defined5 = function _defined5(option) {
                            return option.value;
                        };

                        for (var _i6 = 0; _i6 <= _defined4.length - 1; _i6++) {
                            _value[_i6] = _defined5(_defined4[_i6], _i6, _defined4);
                        }
                    }
                    instance.props[value] = castStringTo(_value);
                }
            });
        };

        for (var _i2 = 0; _i2 <= events.length - 1; _i2++) {
            _defined(events[_i2], _i2, events);
        }

        // Map $target element with prop name


        if (instance._boundElements[value] !== undefined) {
            instance._boundElements[value].push($target);
        } else {
            instance._boundElements[value] = [$target];
        }

        // Set first value
        // Why this delay? because I need to waiting options tag
        delay(function () {
            _this2.updateBoundElement($target, instance.props[value]);
        });
    },
    updateBoundElementsByChanges: function updateBoundElementsByChanges(instance, changes) {
        var _this3 = this;

        var _defined8 = function _defined8(item) {
            var value = item.newValue;
            var property = item.property;
            _this3.updateBoundElements(instance, value, property);
        };

        for (var _i10 = 0; _i10 <= changes.length - 1; _i10++) {
            _defined8(changes[_i10], _i10, changes);
        }
    },
    updateBoundElementsByPropsIteration: function updateBoundElementsByPropsIteration(instance) {
        var _this = this;
        (function iterate(props) {
            var keys = Object.keys(props);
            for (var i = 0, l = keys.length; i < l; i++) {
                var property = keys[i];
                if (props[property] instanceof Object && props[property] !== null) {
                    iterate(props[property]);
                } else {
                    _this.updateBoundElements(instance, props[property], property);
                }
            }
        })(instance._rawProps);
    },
    updateBoundElements: function updateBoundElements(instance, value, property) {
        var _this4 = this;

        if (Object.prototype.hasOwnProperty.call(instance._boundElements, property)) {
            var _defined9 = function _defined9($target) {
                _this4.updateBoundElement($target, value);
            };

            var _defined10 = instance._boundElements[property];

            for (var _i12 = 0; _i12 <= _defined10.length - 1; _i12++) {
                _defined9(_defined10[_i12], _i12, _defined10);
            }
        }
    },
    updateBoundElement: function updateBoundElement($target, value) {
        if ($target.type === 'checkbox') {
            if (!$target.defaultValue) $target.checked = value;else if (Array.isArray(value)) {
                var inputs = document.querySelectorAll('input[name=' + $target.name + '][type=checkbox]');

                var _defined11 = function _defined11(input) {
                    return input.checked = value.includes(input.value);
                };

                var _defined12 = [].concat(_toConsumableArray(inputs));

                for (var _i14 = 0; _i14 <= _defined12.length - 1; _i14++) {
                    _defined11(_defined12[_i14], _i14, _defined12);
                }
            }
        } else if ($target.type === 'radio') {
            $target.checked = $target.value === value;
        } else if ($target.type === 'select-multiple' && Array.isArray(value)) {
            var _defined13 = function _defined13(option) {
                return option.selected = value.includes(option.value);
            };

            var _defined14 = [].concat(_toConsumableArray($target.options));

            for (var _i16 = 0; _i16 <= _defined14.length - 1; _i16++) {
                _defined13(_defined14[_i16], _i16, _defined14);
            }
        } else {
            $target.value = value;
        }
    }
});

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(0),
    directive = _require.directive;

var _require2 = __webpack_require__(1),
    COMPONENT_DYNAMIC_INSTANCE = _require2.COMPONENT_DYNAMIC_INSTANCE;

var ATTR_KEY = 'data-key';

directive('key', {
    onAppComponentCreate: function onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            _dynamicNodes: {
                value: {},
                writable: true
            },
            _keyedNodes: {
                value: {},
                writable: true
            }
        });
    },
    onAppComponentPropsAssignName: function onAppComponentPropsAssignName($target, propName, propValue, isDirective, props) {
        if (propName === ATTR_KEY) {
            props.key = propValue;
        }
    },
    onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
        $target.dataset.key = directiveValue;
        instance._keyedNodes[directiveValue] = $target;
    },
    onAppDynamicInstanceCreate: function onAppDynamicInstanceCreate(instance, dynamicInstance, item) {
        if (item.node.dataset.key) {
            instance._dynamicNodes[item.node.dataset.key] = dynamicInstance._rootElement.parentNode;
        }
    },
    onAppComponentRenderOverwrite: function onAppComponentRenderOverwrite(instance, changes, next, prev) {
        var candidateKeyToRemove = void 0;
        var thereIsDelete = false;
        var noCmpKeyRemoved = false;

        var _defined = function _defined(change) {

            if (change.previousValue && _typeof(change.previousValue) === 'object' && Object.keys(change.previousValue).length) {
                if (change.target && _typeof(change.target) === 'object') {
                    var oK = Object.keys(change.target);
                    if (oK.length && Array.isArray(change.target[oK])) {
                        if (change.target[oK].length && change.target[oK][0] && _typeof(change.target[oK][0]) === 'object' && change.target[oK][0].key !== undefined) {

                            // Just if deleted keys
                            if (change.previousValue.length > change.newValue.length) {
                                var _defined2 = change.previousValue;

                                var _defined3 = function _defined3(item) {
                                    return item.key;
                                };

                                //console.log('ci sono key, posso fare qualcosa', typeof change.previousValue);
                                var prevKeys = new Array(_defined2.length);

                                for (var _i8 = 0; _i8 <= _defined2.length - 1; _i8++) {
                                    prevKeys[_i8] = _defined3(_defined2[_i8], _i8, _defined2);
                                }

                                var _defined4 = change.newValue;

                                var _defined5 = function _defined5(item) {
                                    return item.key;
                                };

                                var newKeys = new Array(_defined4.length);

                                for (var _i9 = 0; _i9 <= _defined4.length - 1; _i9++) {
                                    newKeys[_i9] = _defined5(_defined4[_i9], _i9, _defined4);
                                }

                                var _defined6 = function _defined6(n) {
                                    return newKeys.indexOf(n) === -1;
                                };

                                var doRemoveKeys = [];

                                for (var _i10 = 0; _i10 <= prevKeys.length - 1; _i10++) {
                                    if (_defined6(prevKeys[_i10], _i10, prevKeys)) doRemoveKeys.push(prevKeys[_i10]);
                                }

                                noCmpKeyRemoved = !!doRemoveKeys.length;

                                var _defined7 = function _defined7(item) {
                                    if (instance._keyedNodes[item]) instance._keyedNodes[item].parentNode.removeChild(instance._keyedNodes[item]);
                                };

                                for (var _i7 = 0; _i7 <= doRemoveKeys.length - 1; _i7++) {
                                    _defined7(doRemoveKeys[_i7], _i7, doRemoveKeys);
                                }
                            }
                        }
                    }
                }
            }

            // Trova la presunta chiave da eliminare
            if (Array.isArray(change.target)) {
                if ((change.type === 'update' || change.type === 'delete') && candidateKeyToRemove === undefined) {

                    if (change.previousValue && _typeof(change.previousValue) === 'object' && change.previousValue.key !== undefined) {
                        candidateKeyToRemove = change.previousValue.key;
                    }
                }
                if (change.type === 'delete') thereIsDelete = true;
            }

            // Se l'array viene svuotato allora dovrò cercare tutte le eventuali chiavi che fanno riferimento ai nodi
            if (candidateKeyToRemove === undefined && Array.isArray(change.previousValue) && !Array.isArray(change.newValue) || Array.isArray(change.previousValue) && change.previousValue.length > change.newValue.length) {
                var _defined8 = function _defined8(item) {
                    if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item.key !== undefined && instance._dynamicNodes[item.key] !== undefined) {
                        if (instance._dynamicNodes[item.key][COMPONENT_DYNAMIC_INSTANCE]) {
                            instance._dynamicNodes[item.key][COMPONENT_DYNAMIC_INSTANCE].destroy();
                        } else {
                            instance._dynamicNodes[item.key].parentNode.removeChild(instance._dynamicNodes[item.key]);
                        }
                    }
                };

                var _defined9 = change.previousValue;

                for (var _i12 = 0; _i12 <= _defined9.length - 1; _i12++) {
                    _defined8(_defined9[_i12], _i12, _defined9);
                }
            }
        };

        for (var _i2 = 0; _i2 <= changes.length - 1; _i2++) {
            _defined(changes[_i2], _i2, changes);
        }

        if (noCmpKeyRemoved) return true;

        //console.log(thereIsDelete, candidateKeyToRemove)
        //console.log(instance._keyedNodes, candidateKeyToRemove)
        if (!thereIsDelete) candidateKeyToRemove = undefined;

        if (candidateKeyToRemove !== undefined) {
            if (instance._dynamicNodes[candidateKeyToRemove] !== undefined) {
                if (instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE]) {
                    instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE].destroy();
                } else {
                    //console.log(instance._dynamicNodes[candidateKeyToRemove]);
                    instance._dynamicNodes[candidateKeyToRemove].parentNode.removeChild(instance._dynamicNodes[candidateKeyToRemove]);
                }
                return true;
            } else if (instance._keyedNodes[candidateKeyToRemove] !== undefined) {
                instance._keyedNodes[candidateKeyToRemove].parentNode.removeChild(instance._keyedNodes[candidateKeyToRemove]);
                return true;
            }
        }
    }
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    directive = _require.directive;

directive('show', {
    setVisible: function setVisible($target, value) {
        $target.style.display = value === 'false' ? 'none' : '';
    },
    onComponentDOMElementCreate: function onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },
    onComponentDOMElementUpdate: function onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    }
});

/***/ })
/******/ ]);
}); 