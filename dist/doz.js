// [AIV_SHORT]  Doz Build version: 0.0.0  
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(3),
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// [AIV]  Defaulty Build version: 2.1.0  
(function webpackUniversalModuleDefinition(root, factory) {
  if (( false ? 'undefined' : _typeof2(exports)) === 'object' && ( false ? 'undefined' : _typeof2(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["defaulty"] = factory();else root["defaulty"] = factory();
})(typeof self !== 'undefined' ? self : undefined, function () {
  return (/******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/
        }
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
          return module['default'];
        } :
        /******/function getModuleExports() {
          return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 0);
      /******/
    }(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      module.exports = __webpack_require__(1);

      /***/
    },
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

      var deepCopy = __webpack_require__(2);

      /**
       * Copies deep missing properties to the target object
       * @param targetObj {Object} target object
       * @param defaultObj {Object} default object
       * @param exclude {Array} exclude properties from copy
       * @returns {*}
       */

      var defaulty = function defaulty(targetObj, defaultObj) {
        var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        for (var i in defaultObj) {
          /* istanbul ignore else  */
          if (defaultObj.hasOwnProperty(i) && exclude.indexOf(i) === -1) {
            if (!targetObj.hasOwnProperty(i) || typeof targetObj[i] === 'undefined') {
              targetObj[i] = defaultObj[i];
            } else if (_typeof(targetObj[i]) === 'object') {
              defaulty(targetObj[i], defaultObj[i]);
            }
          }
        }
        return targetObj;
      };

      /**
       * Creates new target object and copies deep missing properties to the target object
       * @param args[0] {Object} target object
       * @param args[1] {Object} default object
       * @param args[2] {Array} exclude properties from copy
       * @returns {*}
       */
      var copy = function copy() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        //args[0] = Object.assign({}, args[0]);
        args[0] = deepCopy(args[0]);
        return defaulty.apply(undefined, args);
      };

      module.exports = defaulty;
      module.exports.copy = copy;

      /***/
    },
    /* 2 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

      ;(function (name, root, factory) {
        if ((false ? 'undefined' : _typeof(exports)) === 'object') {
          module.exports = factory();
        }
        /* istanbul ignore next */
        else if (true) {
            !(__WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
          } else {
            root[name] = factory();
          }
      })('dcopy', undefined, function () {
        /**
         * Deep copy objects and arrays
         *
         * @param {Object/Array} target
         * @return {Object/Array} copy
         * @api public
         */

        return function (target) {
          if (/number|string|boolean/.test(typeof target === 'undefined' ? 'undefined' : _typeof(target))) {
            return target;
          }
          if (target instanceof Date) {
            return new Date(target.getTime());
          }

          var copy = target instanceof Array ? [] : {};
          walk(target, copy);
          return copy;

          function walk(target, copy) {
            for (var key in target) {
              var obj = target[key];
              if (obj instanceof Date) {
                var value = new Date(obj.getTime());
                add(copy, key, value);
              } else if (obj instanceof Function) {
                var value = obj;
                add(copy, key, value);
              } else if (obj instanceof Array) {
                var value = [];
                var last = add(copy, key, value);
                walk(obj, last);
              } else if (obj instanceof Object) {
                var value = {};
                var last = add(copy, key, value);
                walk(obj, last);
              } else {
                var value = obj;
                add(copy, key, value);
              }
            }
          }
        };

        /**
         * Adds a value to the copy object based on its type
         *
         * @api private
         */

        function add(copy, key, value) {
          if (copy instanceof Array) {
            copy.push(value);
            return copy[copy.length - 1];
          } else if (copy instanceof Object) {
            copy[key] = value;
            return copy[key];
          }
        }
      });

      /***/
    }]
    /******/)
  );
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var extend = __webpack_require__(1);

var _require = __webpack_require__(0),
    register = _require.register;

var html = __webpack_require__(4);

var _require2 = __webpack_require__(3),
    INSTANCE = _require2.INSTANCE,
    PARSER = _require2.PARSER,
    SIGN = _require2.SIGN;

var collection = __webpack_require__(0);
//const helper = require('./helper');
var observer = __webpack_require__(11);
var events = __webpack_require__(12);

var _require3 = __webpack_require__(5),
    transform = _require3.transform,
    serializeProps = _require3.serializeProps;

var update = __webpack_require__(6).updateElement;

function component(tag) {
    var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!PARSER.REGEX.TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-): my-component');
    }

    var cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        template: function template() {
            return '<div></div>';
        },

        props: {}
    });

    register(cmp);
}

function getInstances(root, template) {

    template = typeof template === 'string' ? html.create(template) : template;

    //console.log(template.innerHTML)

    var nodes = html.getAllNodes(template);
    var components = [];

    nodes.forEach(function (child) {

        if (child.nodeType === 1 && child.parentNode) {

            var cmp = collection.get(child.nodeName);

            if (cmp) {
                var alias = Math.random();
                var props = serializeProps(child);

                if (props.hasOwnProperty('is-alias')) {
                    alias = props['is-alias'];
                }

                var newElement = createInstance(cmp, {
                    root: root,
                    props: props
                });

                // Remove old
                child.parentNode.removeChild(child);
                newElement.render();

                events.callRender(newElement);

                components.push(_defineProperty({}, alias, newElement));

                var nested = newElement._rootElement.querySelectorAll('*');

                Array.from(nested).forEach(function (item) {
                    if (PARSER.REGEX.TAG.test(item.nodeName)) {
                        var _template = item.outerHTML;
                        var rootElement = document.createElement(item.nodeName);
                        item.parentNode.replaceChild(rootElement, item);
                        getInstances(rootElement, _template);
                    }
                });
            }
        }
    });

    return components;
}

function createInstance(cmp, cfg) {
    var props = extend.copy(cfg.props, typeof cmp.cfg.props === 'function' ? cmp.cfg.props() : cmp.cfg.props);
    var instance = {};
    var isCreated = false;

    Object.defineProperties(instance, {
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
        each: {
            value: function value(obj, func) {
                return obj.map(func).join('');
            },
            enumerable: true
        },
        render: {
            value: function value() {
                var tpl = html.create(this.template());
                var next = transform(tpl);
                var rootElement = update(cfg.root, next, this._prev, 0, this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        destroy: {
            value: function value() {
                if (!this._rootElement) return;
                this._rootElement.parentNode.removeChild(this._rootElement);
                events.callDestroy(this);
            },
            enumerable: true
        }
    });

    instance = Object.assign(instance, cmp.cfg);

    instance.props = observer.create(props, true, function (changes) {
        instance.render();

        changes.forEach(function (item) {
            if (instance._boundElements.hasOwnProperty(item.property)) {
                instance._boundElements[item.property].forEach(function (element) {
                    element.value = item.newValue;
                });
            }
        });

        if (isCreated) {
            events.callUpdate(instance);
        }
    });

    observer.beforeChange(instance.props, function () {
        var res = events.callBeforeUpdate(Object.assign({}, instance.props));
        if (res === false) return false;
    });

    events.callCreate(instance);
    isCreated = true;

    return instance;
}

module.exports = {
    component: component,
    getInstances: getInstances
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    ROOT: '__DOZ__',
    SIGN: '__DOZ_SIGN__',
    INSTANCE: '__DOZ_INSTANCE__',
    EVENTS: ['show', 'hide', 'beforeContentChange', 'contentChange', 'state', 'beforeState'],
    PARSER: {
        REGEX: {
            TAG: /^\w+-[\w-]+$/,
            ATTR: /{{([\w.]+)}}/,
            TEXT: /(?!<.){{([\w.]+)}}(?!.>)/g
        }
    },
    ATTR: {
        WIDGET: 'doz-medom-widget'
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html = {
    /**
     * Create DOM element
     * @param str html string or a single tag
     * @returns {Element | Node | null}
     */
    create: function create(str) {
        var element = void 0;
        //str = str.replace(/\n|\t|\r|\s{2,}/g,'');
        str = str.replace(/\n|\s{2,}/g, ' ');
        str = str.replace(/[\t\r]/g, '');
        str = str.replace(/>(\s+)</g, '><');
        str = str.trim();
        //console.log(str)
        if (/<.*>/g.test(str)) {
            var template = document.createElement('div');
            template.innerHTML = str;
            element = template.firstChild;
        } else {
            element = document.createElement(str);
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

    /**
     * Append multiple elements into target element
     * @param {Element} target
     * @param {Array | Element} els
     * @returns {Element | Node | Error}
     */
    render: function render(target, els) {
        els = Array.isArray(els) ? els : [els];
        if (!this.isValidNode(target)) throw new Error('Require a valid HTML Element');

        els.forEach(function (el) {
            target.appendChild(el);
        });
        return target;
    },

    getAllNodes: function getAllNodes(el) {

        var nodes = [];

        function scanner(n) {
            do {
                nodes.push(n);
                if (n.hasChildNodes()) {
                    scanner(n.firstChild);
                }
            } while (n = n.nextSibling);
        }

        scanner(el);

        //console.log('NODE-B',nodes);

        return nodes;
    }
};

module.exports = html;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var castStringTo = __webpack_require__(13);

function serializeProps(node) {
    var props = {};

    if (node.attributes.length) Array.from(node.attributes).forEach(function (attr) {
        props[attr.name] = attr.nodeValue === '' ? true : castStringTo(attr.nodeValue);
    });

    return props;
}

function transform(node) {

    var root = {};

    function walking(node, parent) {
        do {
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
        } while (node = node.nextSibling);
    }

    walking(node, root);

    return root;
}

module.exports = {
    transform: transform,
    serializeProps: serializeProps
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isEventAttribute(name) {
    return (/^on/.test(name)
    );
}

function isBoundAttribute(name) {
    return (/^is-bound/.test(name)
    );
}

function canBind($target) {
    return ['INPUT', 'TEXTAREA'].indexOf($target.nodeName) !== -1;
}

function isCustomAttribute(name) {
    return isEventAttribute(name) || isBoundAttribute(name) || name === 'forceUpdate';
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

function setAttribute($target, name, value) {
    if (isCustomAttribute(name)) {} else if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
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

    var props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(function (name) {
        updateAttribute($target, name, newProps[name], oldProps[name]);
    });
}

function addEventListener($target, name, value, cmp) {

    if (!isEventAttribute(name)) return;

    var match = value.match(/^this.(.*)\((.*)\)/);

    if (match) {
        var args = null;
        var handler = match[1];
        var stringArgs = match[2];
        if (stringArgs) {
            args = stringArgs.split(',').map(function (item) {
                return item.trim();
            });
        }

        if (handler in cmp) {
            value = args ? cmp[handler].bind(cmp, args) : cmp[handler].bind(cmp);
        }
    }

    $target.addEventListener(extractEventName(name), value);
}

function setModel($target, name, value, cmp) {
    if (!isBoundAttribute(name) || !canBind($target)) return;
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

function attach($target, props, cmp) {
    Object.keys(props).forEach(function (name) {
        setAttribute($target, name, props[name]);
        addEventListener($target, name, props[name], cmp);
        setModel($target, name, props[name], cmp);
    });
}

function createElement(node, cmp) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    var $el = document.createElement(node.type);

    attach($el, node.props, cmp);

    node.children.map(function (item) {
        return createElement(item, cmp);
    }).forEach($el.appendChild.bind($el));
    return $el;
}

function changed(nodeA, nodeB) {
    return (typeof nodeA === 'undefined' ? 'undefined' : _typeof(nodeA)) !== (typeof nodeB === 'undefined' ? 'undefined' : _typeof(nodeB)) || typeof nodeA === 'string' && nodeA !== nodeB || nodeA.type !== nodeB.type || nodeA.props && nodeA.props.forceUpdate;
}

function updateElement($parent, newNode, oldNode) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var cmp = arguments[4];

    if (!$parent) return;

    if (!oldNode) {
        var rootElement = createElement(newNode, cmp);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index]) $parent.removeChild($parent.childNodes[index]);
    } else if (changed(newNode, oldNode)) {
        var _rootElement = createElement(newNode, cmp);
        $parent.replaceChild(_rootElement, $parent.childNodes[index]);
        return _rootElement;
    } else if (newNode.type) {
        updateAttributes($parent.childNodes[index], newNode.props, oldNode.props);
        var newLength = newNode.children.length;
        var oldLength = oldNode.children.length;
        for (var i = 0; i < newLength || i < oldLength; i++) {
            updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i, cmp);
        }
    }
}

module.exports = {
    updateElement: updateElement
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(8);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(9);
module.exports.component = __webpack_require__(2).component;
module.exports.collection = __webpack_require__(0);
module.exports.update = __webpack_require__(6).updateElement;
module.exports.transform = __webpack_require__(5).transform;
module.exports.html = __webpack_require__(4);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = __webpack_require__(1);
var component = __webpack_require__(2);

var Doz = function Doz() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Doz);

    /*if (typeof cfg.root !== 'string') {
        throw new TypeError('root must be a string selector and is required');
    }*/

    /*this.cfg = extend.copy(cfg, {
        template: '<div></div>'
    });*/

    this.cfg = Object.assign({}, cfg);

    //this.dom = document.querySelector(this.cfg.el);
    this.components = component.getInstances(this.cfg.root, this.cfg.template) || [];

    // Set initial defaultProps
    //this.setProps();
}

/*setProps(props) {
    this.components.forEach(cmp => {
        component.setProps(props || {},  cmp.defaultProps, cmp.propsMap);
    })
}*/

;

module.exports = Doz;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 11 */
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

                var t = targets.indexOf(target);
                if (t > -1) {
                    var j = targetsProxy[t].length;
                    while (j--) {
                        var beforeChange = targetsProxy[t][j].observable.beforeChange;
                        if (typeof beforeChange === 'function') {
                            var res = beforeChange(changes);
                            if (res === false) return false;
                        }
                    }
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

                    var t = targets.indexOf(target);
                    if (t > -1) {
                        var j = targetsProxy[t].length;
                        while (j--) {
                            var beforeChange = targetsProxy[t][j].observable.beforeChange;
                            if (typeof beforeChange === 'function') {
                                var res = beforeChange(changes);
                                if (res === false) return false;
                            }
                        }
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

            // fire off the _create() method -- it will create a new observable and proxy and return the proxy
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
        return context.onBeforeUpdate.call(context);
    }
}

function callUpdate(context) {
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context);
    }
}

function callDestroy(context) {
    if (typeof context.onDestroy === 'function') {
        context.onDestroy.call(context);
        context = null;
    }
}

module.exports = {
    callCreate: callCreate,
    callRender: callRender,
    callBeforeUpdate: callBeforeUpdate,
    callUpdate: callUpdate,
    callDestroy: callDestroy
};

/***/ }),
/* 13 */
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

/***/ })
/******/ ]);
}); 