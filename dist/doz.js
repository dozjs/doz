/* Doz, version: 4.0.3 - October 6, 2022 15:06:53 */
function bind$1(obj, context) {
    if (typeof obj !== 'object' || obj == null) {
        throw new TypeError('expected an object!');
    }
    let target = Object.assign({}, obj);
    let keys = Object.keys(obj);
    for (let i = keys.length - 1; i >= 0; --i) {
        let item = target[keys[i]];
        if (typeof item === 'function') {
            target[keys[i]] = item.bind(context);
        }
        else if (typeof item === 'object' && item != null) {
            target[keys[i]] = bind$1(item, context);
        }
    }
    return target;
}

const regexN = /\n/g;
const regexS = /\s+/g;
const replace = ' ';
let decoder;
const html = {
    /**
     * Create DOM element
     * @param str html string
     * @param wrapper tag string
     * @returns {Element | Node | null}
     */
    create(str, wrapper) {
        let element;
        str = str.replace(regexN, replace);
        str = str.replace(regexS, replace);
        let template = document.createElement('div');
        template.innerHTML = str;
        if (wrapper && template.childNodes.length > 1) {
            element = document.createElement(wrapper);
            element.innerHTML = template.innerHTML;
        }
        else {
            element = template.firstChild || document.createTextNode('');
        }
        return element;
    },
    decode(str) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = str;
        return decoder.textContent;
    }
};

const COMPONENT_DYNAMIC_INSTANCE = 'componentDynamicInstance';
const COMPONENT_INSTANCE = 'componentInstance';
const COMPONENT_ROOT_INSTANCE = 'componentRootInstance';
const PROPS_ATTRIBUTES = 'props';
const ALREADY_WALKED = 'walked';
const DEFAULT_SLOT_KEY = '__default__';
const NS = {
    SVG: 'http://www.w3.org/2000/svg'
};
const TAG = {
    ROOT: 'dz-root',
    EACH: 'dz-each-root',
    APP: 'dz-app',
    EMPTY: 'dz-empty',
    MOUNT: 'dz-mount',
    SLOT: 'dz-slot',
    SLOT_UPPERCASE: 'DZ-SLOT',
    SUFFIX_ROOT: '-root',
    TEXT_NODE_PLACE: 'dz-text-node',
    ITERATE_NODE_PLACE: 'dz-iterate-node',
};
const REGEX = {
    IS_DIRECTIVE: /^d[-:][\w-]+$/,
    IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
    IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
    IS_LISTENER: /^on/,
    IS_ID_SELECTOR: /^#[\w-_:.]+$/,
    IS_PARENT_METHOD: /^parent.(.*)/,
    IS_STRING_QUOTED: /^"\w+"/,
    IS_SVG: /^svg$/,
    GET_LISTENER: /^this.(.*)\((.*)\)/,
    GET_LISTENER_SCOPE: /^scope.(.*)\((.*)\)/,
    IS_LISTENER_SCOPE: /(^|\()scope[.)]/g,
    TRIM_QUOTES: /^["'](.*)["']$/,
    THIS_TARGET: /\B\$this(?!\w)/g,
    HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>|<\/>/ig,
    HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
    MATCH_NLS: /\n\s+/gm,
    REPLACE_QUOT: /"/g,
    REPLACE_D_DIRECTIVE: /^d[-:]/,
    EXTRACT_STYLE_DISPLAY_PROPERTY: /display(?:\s+)?:(?:\s+)?([\w-]+)/
};
const ATTR = {
    // Attributes for both
    FORCE_UPDATE: 'forceupdate'
};

const components = {};
const webComponents = {
    tags: {},
    ids: {}
};
const plugins = [];
const directives$1 = {};
const directivesKeys = [];
var data = {
    components,
    webComponents,
    plugins,
    directives: directives$1,
    directivesKeys
};

class Base {
    constructor(opt = {}) {
        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };
        opt.app = opt.app || {};
        this._opt = opt;
        this._cfgRoot = opt.root;
        this._publicProps = Object.assign({}, opt.props);
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
        this._rawHTML = '';
        this._hasSlots = false;
        this._slots = {};
        this._defaultSlot = null;
        this._localComponentLastId = 0;
        this._currentStyle = '';
        this._componentsMap = new Map();
        this.tag = opt.cmp.tag;
        this.app = opt.app;
        this.exposeAttributes = ['style', 'class'];
        this.parent = opt.parentCmp;
        this.appRoot = opt.app._root;
        this.action = opt.app.action;
        this.shared = opt.app.shared;
        this.childrenToWalk = [];
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
        this.propsData = {};
        this.lockRemoveInstanceByCallback = null;
        this.waitMount = false;
/*
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
            _hasSlots: {
                value: false,
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
            _localComponentLastId: {
                value: 0,
                writable: true
            },
            _currentStyle: {
                value: '',
                writable: true
            },
            _componentsMap: {
                value: new Map()
            },
            //Public
            tag: {
                value: opt.cmp.tag,
                enumerable: true,
                writable: true
            },
            app: {
                value: opt.app,
                enumerable: true
            },
            exposeAttributes: {
                value: ['style', 'class'],
                enumerable: true,
                writable: true
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
            childrenToWalk: {
                value: [],
                enumerable: true
            },
            _childrenInc: {
                value: 0,
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
            rawChildrenVnode: {
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
            },
            propsData: {
                value: {},
                enumerable: true,
                writable: true
            },
            lockRemoveInstanceByCallback: {
                value: null,
                enumerable: true,
                writable: true
            },
            waitMount: {
                value: false,
                enumerable: true,
                writable: true
            }
        });
*/

    }
}

/**
 * Register a component to global
 * @param cmp
 */
function registerComponent(cmp) {
    const tag = cmp.tag.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(data.components, tag))
        console.warn('Doz', `component ${tag} overwritten`);
    data.components[tag] = cmp;
}
/**
 * Remove all global components
 */
function removeAll() {
    data.components = {};
    //data.plugins = [];
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
function registerDirective(name, cfg = {}) {
    //console.log('directive', name)
    if (typeof name !== 'string') {
        throw new TypeError('Doz directive name must be a string');
    }
    if (typeof cfg !== 'object' || !cfg) {
        throw new TypeError('Doz directive config must be an object');
    }
    if (name[0] === ':') {
        cfg._onlyDozComponent = true;
        name = name.substr(1);
    }
    name = name.toLowerCase();
    let namePart = [];
    if (name.indexOf('-') !== -1) {
        namePart = name.split('-');
        name = namePart[0];
        namePart.shift();
    }
    cfg.name = name;
    cfg._keyArguments = namePart.map(item => item.substring(1)); // remove $
    if (Object.prototype.hasOwnProperty.call(data.directives, name))
        console.warn('Doz', `directive ${name} overwritten`);
    data.directives[name] = cfg;
    if (!data.directivesKeys.includes(name))
        data.directivesKeys.push(name);
}
var collection = {
    registerComponent,
    registerPlugin,
    getComponent,
    registerDirective,
    removeAll,
    data
};

let d = window.setTimeout.bind(window);
if (window.requestAnimationFrame) {
    d = window.requestAnimationFrame.bind(window);
}
var delay = d;

//import delay from "../../utils/delay.js";
// All methods that starts with prefix callApp are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id
function callMethod$1(...args) {
    //return;
    //console.log(data.directivesKeys)
    let method = args.shift();
    let oKeys = /*['store'];*/ data.directivesKeys; // Object.keys(data.directives);
    let callback;
    //let isDelayed = args[1] === 'delay'
    // Search for a possible callback
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'function') {
            callback = args[i];
            break;
        }
    }
    //console.log(oKeys, args)
    for (let i = 0; i < oKeys.length; i++) {
        let key = oKeys[i];
        //if (data.directives[key] /*!== undefined*/) {
            //console.log(data.directives[key])
            //if (typeof data.directives[key][method] === 'function') {
            if (data.directives[key][method] /*!== undefined*/) {
                let res = data.directives[key][method].apply(data.directives[key], args);
                //console.log(key, method, res)
                // If res returns something, fire the callback
                if (res !== undefined && callback)
                    callback(res);
            }
        //}
    }
}
function callAppInit(...args) {
    let resArgs = ['onAppInit'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppInit', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentCreate(...args) {
    let resArgs = ['onAppComponentCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentCreate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentBeforeCreate(...args) {
    let resArgs = ['onAppComponentBeforeCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeCreate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentConfigCreate(...args) {
    let resArgs = ['onAppComponentConfigCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentConfigCreate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentBeforeMount(...args) {
    let resArgs = ['onAppComponentBeforeMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeMount', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentMount(...args) {
    let resArgs = ['onAppComponentMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentMount', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentMountAsync(...args) {
    let resArgs = ['onAppComponentMountAsync'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentMountAsync', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentBeforeUpdate(...args) {
    let resArgs = ['onAppComponentBeforeUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeUpdate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentUpdate(...args) {
    let resArgs = ['onAppComponentUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentUpdate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentDrawByParent(...args) {
    let resArgs = ['onAppComponentDrawByParent'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentDrawByParent', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentAfterRender(...args) {
    let resArgs = ['onAppComponentAfterRender'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAfterRender', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentBeforeUnmount(...args) {
    let resArgs = ['onAppComponentBeforeUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeUnmount', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentUnmount(...args) {
    let resArgs = ['onAppComponentUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentUnmount', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentBeforeDestroy(...args) {
    let resArgs = ['onAppComponentBeforeDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeDestroy', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentSetConfig(...args) {
    let resArgs = ['onAppComponentSetConfig'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentSetConfig', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentSetProps(...args) {
    let resArgs = ['onAppComponentSetProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentSetProps', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentLoadProps(...args) {
    let resArgs = ['onAppComponentLoadProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentLoadProps', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentDestroy(...args) {
    let resArgs = ['onAppComponentDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentDestroy', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentAssignIndex(...args) {
    let resArgs = ['onAppComponentAssignIndex'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAssignIndex', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppWalkDOM(...args) {
    let resArgs = ['onAppWalkDOM'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppWalkDOM', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentAssignName(...args) {
    let resArgs = ['onAppComponentAssignName'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAssignName', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentPropsAssignName(...args) {
    let resArgs = ['onAppComponentPropsAssignName'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentPropsAssignName', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppDOMElementCreate(...args) {
    //todo Dovrebbe risolvere il problema del tag doppio
    let resArgs = ['onAppDOMElementCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppDOMElementCreate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppDynamicInstanceCreate(...args) {
    let resArgs = ['onAppDynamicInstanceCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppDynamicInstanceCreate', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentRenderOverwrite(...args) {
    let resArgs = ['onAppComponentRenderOverwrite'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentRenderOverwrite', ...args];
    callMethod$1.apply(null, resArgs);
}
function callAppComponentWaitMount(...args) {
    let resArgs = ['onAppComponentWaitMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentWaitMount', ...args];
    callMethod$1.apply(null, resArgs);
}
var app = {
    callAppInit,
    callAppComponentCreate,
    callAppComponentLoadProps,
    callAppComponentSetConfig,
    callAppComponentSetProps,
    callAppComponentDestroy,
    callAppComponentAssignIndex,
    callAppComponentBeforeCreate,
    callAppComponentConfigCreate,
    callAppComponentBeforeMount,
    callAppComponentMount,
    callAppComponentBeforeDestroy,
    callAppComponentUnmount,
    callAppComponentBeforeUnmount,
    callAppComponentAfterRender,
    callAppComponentDrawByParent,
    callAppComponentUpdate,
    callAppComponentBeforeUpdate,
    callAppComponentMountAsync,
    callAppWalkDOM,
    callAppComponentAssignName,
    callAppDOMElementCreate,
    callAppDynamicInstanceCreate,
    callAppComponentPropsAssignName,
    callAppComponentRenderOverwrite,
    callAppComponentWaitMount
};

var isEmptyObject = (function isEmptyObject(obj) {
    for(let i in obj) return false;
    return true;
});

function extractDirectivesFromProps(cmp) {
    let props;

    if (isEmptyObject(cmp.props)) {
        props = cmp._rawProps;
    } else {
        props = cmp.props;
    }
    //console.log(cmp.uId, props)
    //if (!isEmptyObject(cmp.props))
    if (!cmp._directiveProps) cmp._directiveProps = {};
    for (let key in props) {
        if (isDirective(key)) {
            let keyWithoutD = key.substring(2);
            console.log(cmp.uId, keyWithoutD, props[key]);
            cmp._directiveProps[keyWithoutD] = props[key];
        }
    }/**/
    /*Object.keys(props).forEach(key => {
        if (isDirective(key)) {
            let keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            cmp._directiveProps[keyWithoutD] = props[key];
        }
    });*/
    //cmp._directivesExtracted = true;
    //console.log(cmp._directiveProps)
    return cmp._directiveProps;
}
function isDirective(aName) {
    //return REGEX.IS_DIRECTIVE.test(name);
    return aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':');
}
function extractStyleDisplayFromDozProps($target) {
    if (!$target._dozAttach[PROPS_ATTRIBUTES] || !$target._dozAttach[PROPS_ATTRIBUTES].style)
        return null;
    let match = $target._dozAttach[PROPS_ATTRIBUTES].style.match(REGEX.EXTRACT_STYLE_DISPLAY_PROPERTY);
    if (match) {
        return match[1];
    }
    return null;
}
function extractDirectiveNameAndKeyValues(attributeName) {
    attributeName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
    let directiveName = attributeName;
    let keyArgumentsValues = [];
    if (directiveName.indexOf('-') !== -1) {
        keyArgumentsValues = directiveName.split('-');
        directiveName = keyArgumentsValues[0];
        keyArgumentsValues.shift();
    }
    return [directiveName, keyArgumentsValues];
}

//import delay from "../../utils/delay.js";
// Hooks for the component
function callMethod(...args) {
    //return
    let method = args[0];

    let cmp = args[1];
    //let isDelayed = args[2] === 'delay';
    // Remove first argument event name
    args.shift();
    //console.warn(cmp.tag, method, cmp.props)
    let directivesKeyValue = cmp._directiveProps || extractDirectivesFromProps(cmp);
    if(!cmp._directiveKeys) {
        cmp._directiveKeys = Object.keys(directivesKeyValue);
    }
    //console.log(directivesKeyValue)
    //console.log(method, directivesKeyValue)
    cmp._directiveKeys.forEach(key => {
        let keyArgumentsValues = [];
        let keyArguments = {};
        let originKey = key;
        if (key.indexOf('-') !== -1) {
            keyArgumentsValues = key.split('-');
            key = keyArgumentsValues[0];
            keyArgumentsValues.shift();
        }
        let directiveObj = data.directives[key];
        //console.log(method, directiveObj)
        //if (directiveObj)
        //console.warn(method, directiveObj[method])
        if (directiveObj && typeof directiveObj[method] === 'function') {
            // Clone args object
            let outArgs = Object.assign([], args);
            // Add directive value
            outArgs.push(directivesKeyValue[originKey]);
            directiveObj._keyArguments.forEach((keyArg, i) => keyArguments[keyArg] = keyArgumentsValues[i]);
            outArgs.push(keyArguments);
            directiveObj[method].apply(directiveObj, outArgs);
        }
    });
}
function callComponentBeforeCreate(...args) {
    let resArgs = ['onComponentBeforeCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentCreate(...args) {
    let resArgs = ['onComponentCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentBeforeMount(...args) {
    let resArgs = ['onComponentBeforeMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeMount', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentMount(...args) {
    let resArgs = ['onComponentMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentMount', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentMountAsync(...args) {
    let resArgs = ['onComponentMountAsync'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentMountAsync', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentAfterRender(...args) {
    let resArgs = ['onComponentAfterRender'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentAfterRender', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentBeforeUpdate(...args) {
    let resArgs = ['onComponentBeforeUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeUpdate', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentUpdate(...args) {
    let resArgs = ['onComponentUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentUpdate', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentBeforeUnmount(...args) {
    let resArgs = ['onComponentBeforeUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeUnmount', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentUnmount(...args) {
    let resArgs = ['onComponentUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentUnmount', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentBeforeDestroy(...args) {
    let resArgs = ['onComponentBeforeDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeDestroy', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentDestroy(...args) {
    let resArgs = ['onComponentDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentDestroy', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentLoadProps(...args) {
    let resArgs = ['onComponentLoadProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentLoadProps', ...args];
    callMethod.apply(null, resArgs);
}
function callComponentWaitMount(...args) {
    let resArgs = ['onComponentWaitMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentWaitMount', ...args];
    callMethod.apply(null, resArgs);
}
/*
function callComponentsMounted(...args) {
    let resArgs = ['onComponentsMounted'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentsMounted', ...args];
    callMethod.apply(null, resArgs)
}
*/
function callComponentDOMElementCreate(instance, $target, initial) {
    let method = 'onComponentDOMElementCreate';
    if (!$target._dozAttach[PROPS_ATTRIBUTES])
        return;
    let keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);
    for (let i = 0; i < keys.length; i++) {
        let attributeName = keys[i];
        let attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];
        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName); // attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = attributeValue;
            //console.log('directiveValue', directiveValue)
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial, keyArgumentsValues]);
            }
        }
    }
}
function callComponentDOMElementUpdate(instance, $target) {
    let method = 'onComponentDOMElementUpdate';
    if (!$target._dozAttach[PROPS_ATTRIBUTES])
        return;
    let keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);
    for (let i = 0; i < keys.length; i++) {
        let attributeName = keys[i];
        let attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];
        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName); // attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = attributeValue;
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, keyArgumentsValues]);
            }
        }
    }
}
function callComponentVNodeTick(instance, newNode, oldNode) {
    if (!newNode || !newNode.props)
        return;
    let method = 'onComponentVNodeTick';
    let propsKey = Object.keys(newNode.props);
    for (let i = 0; i < propsKey.length; i++) {
        let attributeName = propsKey[i];
        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName); //attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = newNode.props[attributeName]; // || attribute.value;
            //console.log('directiveValue',directiveName, directiveValue)
            let directiveObj = data.directives[directiveName];
            //console.log('aaaaaaa', attributeName, directiveObj)
            if (directiveObj && directiveObj[method]) {
                //delete newNode.props[attributeName];
                directiveObj[method].apply(directiveObj, [instance, newNode, oldNode, directiveValue, keyArgumentsValues]);
            }
        }
    }
}
var component$1 = {
    callComponentBeforeCreate,
    callComponentCreate,
    callComponentBeforeMount,
    callComponentMount,
    callComponentMountAsync,
    callComponentAfterRender,
    callComponentBeforeUpdate,
    callComponentUpdate,
    callComponentBeforeUnmount,
    callComponentUnmount,
    callComponentBeforeDestroy,
    callComponentDestroy,
    callComponentLoadProps,
    callComponentDOMElementCreate,
    callComponentDOMElementUpdate,
    callComponentVNodeTick,
    callComponentWaitMount
};

function directive$c(name, options = {}) {
    registerDirective(name, options);
}
var directives = Object.assign({
    directive: directive$c
}, app, component$1);

function callBeforeCreate(context) {
    directives.callAppComponentBeforeCreate(context);
    directives.callComponentBeforeCreate(context);
    if (typeof context.onBeforeCreate === 'function') {
        return context.onBeforeCreate.call(context);
    }
}
function callCreate(context) {
    directives.callAppComponentCreate(context);
    directives.callComponentCreate(context);
    if (typeof context.onCreate === 'function') {
        context.onCreate.call(context);
    }
    context.app.emit('componentCreate', context);
}
function callConfigCreate(context) {
    directives.callAppComponentConfigCreate(context);
    if (typeof context.onConfigCreate === 'function') {
        context.onConfigCreate.call(context);
    }
    if (context.parent && typeof context.parent[context.__onConfigCreate] === 'function') {
        context.parent[context.__onConfigCreate].call(context.parent, context);
    }
    context.app.emit('componentConfigCreate', context);
}
function callBeforeMount(context) {
    directives.callAppComponentBeforeMount(context);
    directives.callComponentBeforeMount(context);
    if (typeof context.onBeforeMount === 'function') {
        return context.onBeforeMount.call(context);
    }
}
function callMount(context) {
    directives.callAppComponentMount(context);
    directives.callComponentMount(context);
    if (typeof context.onMount === 'function') {
        context.onMount.call(context);
    }
    context.app.emit('componentMount', context);
}
function callMountAsync(context) {
    /*
    delay(() => {
        directive.callAppComponentMountAsync(context);
        directive.callComponentMountAsync(context);
    });
    if (typeof context.onMountAsync === 'function') {
        delay(() => context.onMountAsync.call(context));
    }
    context.app.emit('componentMountAsync', context);
    */
    directives.callAppComponentMountAsync(context);
    directives.callComponentMountAsync(context);
    if (typeof context.onMountAsync === 'function') {
        context.onMountAsync.call(context);
    }
    context.app.emit('componentMountAsync', context);
}
function callBeforeUpdate(context, changes) {
    directives.callAppComponentBeforeUpdate(context, changes);
    directives.callComponentBeforeUpdate(context, changes);
    if (typeof context.onBeforeUpdate === 'function') {
        return context.onBeforeUpdate.call(context, changes);
    }
}
function callUpdate(context, changes) {
    directives.callAppComponentUpdate(context, changes);
    directives.callComponentUpdate(context, changes);
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context, changes);
    }
    context.app.emit('componentUpdate', context, changes);
}
function callDrawByParent(context, newNode, oldNode) {
    if (!context)
        return;
    directives.callAppComponentDrawByParent(context, newNode, oldNode);
    if (typeof context.onDrawByParent === 'function') {
        return context.onDrawByParent.call(context, newNode, oldNode);
    }
    if (context.parent && typeof context.parent[context.__onDrawByParent] === 'function') {
        return context.parent[context.__onDrawByParent].call(context.parent, context, newNode, oldNode);
    }
    //context.app.emit('componentDrawByParent', context, changes);
}
function callAfterRender(context, changes) {
    directives.callAppComponentAfterRender(context, changes);
    directives.callComponentAfterRender(context, changes);
    if (typeof context.onAfterRender === 'function') {
        return context.onAfterRender.call(context, changes);
    }
}
function callBeforeUnmount(context) {
    directives.callAppComponentBeforeUnmount(context);
    directives.callComponentBeforeUnmount(context);
    if (typeof context.onBeforeUnmount === 'function') {
        return context.onBeforeUnmount.call(context);
    }
}
function callUnmount(context) {
    directives.callAppComponentUnmount(context);
    directives.callComponentUnmount(context);
    if (typeof context.onUnmount === 'function') {
        context.onUnmount.call(context);
    }
    context.app.emit('componentUnmount', context);
}
function callBeforeDestroy(context) {
    directives.callAppComponentBeforeDestroy(context);
    directives.callComponentBeforeDestroy(context);
    if (typeof context.onBeforeDestroy === 'function') {
        return context.onBeforeDestroy.call(context);
    }
}
function callDestroy(context) {
    directives.callAppComponentDestroy(context);
    directives.callComponentDestroy(context);
    context.app.emit('componentDestroy', context);
    const style = document.getElementById(context.uId + '--style');
    const styleReset = document.getElementById(context.uId + '--style-reset');
    if (style) {
        style.parentNode.removeChild(style);
    }
    if (styleReset) {
        styleReset.parentNode.removeChild(styleReset);
    }
    if (context._unmountedPlaceholder && context._unmountedPlaceholder.parentNode)
        context._unmountedPlaceholder.parentNode.removeChild(context._unmountedPlaceholder);
    if (typeof context.onDestroy === 'function') {
        context.onDestroy.call(context);
        context = null;
    }
}
function callLoadProps(context) {
    directives.callAppComponentLoadProps(context);
    directives.callComponentLoadProps(context);
    if (typeof context.onLoadProps === 'function') {
        context.onLoadProps.call(context);
    }
    context.app.emit('componentLoadProps', context);
}
function callWaitMount(context) {
    directives.callAppComponentWaitMount(context);
    directives.callComponentWaitMount(context);
    if (typeof context.onWaitMount === 'function') {
        context.onWaitMount.call(context);
    }
    context.app.emit('componentWaitMount', context);
}
var hooks$1 = {
    callBeforeCreate,
    callCreate,
    callConfigCreate,
    callBeforeMount,
    callMount,
    callMountAsync,
    callBeforeUpdate,
    callUpdate,
    callDrawByParent,
    callAfterRender,
    callBeforeUnmount,
    callUnmount,
    callBeforeDestroy,
    callDestroy,
    callLoadProps,
    callWaitMount
};

function dashToCamel(s) {
    return s.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

const kCache = new Map();
const tplCache = Object.create(null);
const hCache = new Map();
var cacheStores = {
    kCache,
    tplCache,
    hCache
};

const regExcludeSpecial = new RegExp(`<\/?(${TAG.TEXT_NODE_PLACE}|${TAG.ITERATE_NODE_PLACE})?>$`);
const selfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
};
const elementsClosedByOpening = {
    li: { li: true },
    p: { p: true, div: true },
    td: { td: true, th: true },
    th: { td: true, th: true }
};
const elementsClosedByClosing = {
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
/*
function removeDoubleQuotes(str) {
    if (typeof str === 'string') {
        if (str === '""' || str === "''")
            return '';
    }
    return str;
}
*/
class Element {
    constructor(name, props, isSVG, style, styleScoped) {
        this.type = name;
        this.props = props; //Object.assign({}, props);
        this.children = [];
        if (style)
            this.style = style;
        if (styleScoped)
            this.styleScoped = styleScoped;
        if (isSVG || name === 'svg')
            this.isSVG = true;
        if (props.key !== undefined)
            this.key = props.key;
        //this.hasKeys = undefined;
    }
    appendChild(node) {
        if (node.props && node.props.key !== undefined) {
            this.hasKeys = true;
        }
        this.children.push(node);
        return node;
    }
}
function compile(tpl) {
    if (!tpl)
        return '';
    //console.log(tpl)
    if (tplCache[tpl]) {
        //console.log('CACHED')
        //console.log(tplCache[tpl])
        return tplCache[tpl];
    }
    const root = new Element(null, {});
    const stack = [root];
    let currentParent = root;
    let lastTextPos = -1;
    let match;
    let props;
    //console.log(tpl)
    while (match = REGEX.HTML_MARKUP.exec(tpl)) {
        if (lastTextPos > -1) {
            if ( /*lastTextPos > -1 && */lastTextPos + match[0].length < REGEX.HTML_MARKUP.lastIndex) {
                // remove new line space
                let text = removeNLS(tpl.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                //const text = (data.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                // if has content
                if (text) {
                    //console.log(currentParent)
                    //console.log(text)
                    //let possibleCompiled = mapper.get(text.trim());
                    //text = placeholderIndex(text, values);
                    //if (!Array.isArray(text)) {
                    //console.log(currentParent)
                    if (currentParent.type === 'style' && currentParent.props['data-is-webcomponent'] !== undefined) {
                        text = text.replace(/:(component|wrapper|root)/g, ':host');
                    }
                    if (currentParent.style === true) {
                        //console.log('currentParent.style', currentParent.style)
                        currentParent.style = text;
                        //console.log(currentParent)
                    }
                    else {
                        if (text.substr(0, 5) === ' e-0_')
                            text = text.trim();
                        currentParent.appendChild(text);
                    }
                    /*} else {
                        currentParent.appendChild(text);
                    }*/
                }
            }
        }
        lastTextPos = REGEX.HTML_MARKUP.lastIndex;
        if (match[0][1] === '!') {
            // this is a comment or style
            continue;
        }
        // Gestisco anche tag chiusura vuoto: <${FooBar}>...</>
        if (match[0] === '</>') {
            let lastTag = last(stack).type;
            // assegno come tag l'ulitmo inserito in modo di avere una corrispondenza
            // <foo-bar>...</foo-bar>
            if (lastTag) {
                match[0] = `</${lastTag}>`;
                match[1] = '/';
                match[2] = lastTag;
            }
        }
        // exclude special text node
        if (regExcludeSpecial.test(match[0])) {
            continue;
        }
        // transform slot to dz-slot
        if (match[2] === 'slot')
            match[2] = TAG.SLOT;
        if (!match[1] && match[0]) {
            // not </ tags
            props = {};
            for (let attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
                props[attMatch[2]] = attMatch[5] || attMatch[6] || '';
                //console.warn(props[attMatch[2]])
                propsFixer(match[0].substring(1, match[0].length - 1), attMatch[2], props[attMatch[2]], props);
            }
            if (!match[4] && elementsClosedByOpening[currentParent.type]) {
                if (elementsClosedByOpening[currentParent.type][match[2]]) {
                    stack.pop();
                    currentParent = last(stack);
                }
            }
            /**/
            if (match[2] === 'style') {
                if (props['data-is-webcomponent'] === undefined) {
                    currentParent.style = true;
                    if (props['data-scoped'] === '') {
                        currentParent.styleScoped = true;
                    }
                    continue;
                }
            }
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
                }
                else {
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
    if (root.style) {
        if (typeof root.children[0] === 'object') {
            //console.log('root.style', root.style)
            root.children[0].style = root.style;
            root.children[0].styleScoped = root.styleScoped;
        }
    }
    if (root.children.length > 1) {
        root.type = TAG.ROOT;
    }
    else if (root.children.length) {
        tplCache[tpl] = root.children[0];
        return root.children[0];
    }
    tplCache[tpl] = root;
    return root;
}
function serializeProps($node) {
    const props = {};
    if ($node._dozAttach[PROPS_ATTRIBUTES]) {
        let keys = Object.keys($node._dozAttach[PROPS_ATTRIBUTES]);
        for (let i = 0; i < keys.length; i++) {
            propsFixer($node.nodeName, keys[i], $node._dozAttach[PROPS_ATTRIBUTES][keys[i]], props);
        }
    }
    else if ($node.attributes) {
        const attributes = Array.from($node.attributes);
        for (let j = attributes.length - 1; j >= 0; --j) {
            let attr = attributes[j];
            propsFixer($node.nodeName, attr.name, attr.nodeValue, props);
        }
    }
    return props;
}
function propsFixer(nName, aName, aValue, props, $node) {
    if (typeof aValue === 'string' && REGEX.IS_STRING_QUOTED.test(aValue))
        aValue = aValue.replace(REGEX.REPLACE_QUOT, '&quot;');
    //let isDirective = REGEX.IS_DIRECTIVE.test(aName);
    let _isDirective = isDirective(aName);
    //console.log('isDirective', isDirective, aName, aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':'));
    let propsName = REGEX.IS_CUSTOM_TAG.test(nName) && !_isDirective
        ? dashToCamel(aName)
        : aName;
    /*
    if ($node) {
        directive.callAppComponentPropsAssignName($node, aName, aValue, _isDirective, props, newPropsName => {
            propsName = newPropsName;
        });
    }*/
    /*
        if (typeof aValue === 'string' && !mapper.isValidId(aValue) && !isListener(aName)) {
            aValue = mapper.getAll(aValue);
        } else {
            let objValue = mapper.get(aValue);
            if (objValue !== undefined) {
                aValue = objValue;
            }
        }*/
    //console.log('AFTER :', aName, aValue)
    props[propsName] = aName === ATTR.FORCE_UPDATE
        ? true
        : aValue;
}

function hmr(instance, _module) {
    if (!_module || !_module.hot)
        return;
    const NS_PROPS = '__doz_hmr_props_store__';
    const NS_INIT_PROPS = '__doz_hmr_init_props_store__';
    window[NS_PROPS] = window[NS_PROPS] || {};
    window[NS_INIT_PROPS] = window[NS_INIT_PROPS] || {};
    const id = _module.id;
    window[NS_PROPS][id] = window[NS_PROPS][id] || new Map();
    window[NS_INIT_PROPS][id] = window[NS_INIT_PROPS][id] || new Map();
    Object.keys(instance.props).forEach(p => {
        if (instance._initialProps[p] === window[NS_INIT_PROPS][id].get(p))
            instance.props[p] = window[NS_PROPS][id].get(p) || instance.props[p];
        else
            instance.props[p] = instance._initialProps[p];
    });
    _module.hot.dispose(() => {
        Object.keys(instance.props).forEach(p => {
            window[NS_PROPS][id].set(p, instance.props[p]);
            window[NS_INIT_PROPS][id].set(p, instance._initialProps[p]);
        });
    });
}

function encode(str) {
    return typeof str === 'string'
        ? str
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/`/g, '&grave;')
        : str;
}
function decode(str) {
    return typeof str === 'string'
        ? str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&grave;/g, '`')
        : str;
}
var stringDecoder = {
    encode,
    decode
};

/**
 * ObservableSlim
 * @type {{create, observe, remove, beforeChange, beginRender, endRender}}
 */
const ObservableSlim = (function () {
    // An array that stores all the observables created through the public create() method below.
    let observables = [];
    // An array of all the objects that we have assigned Proxies to
    let targets = [];
    // An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
    // 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object
    let targetsProxy = [];
    // this variable tracks duplicate proxies assigned to the same target.
    // the 'set' handler below will trigger the same change on all other Proxies tracking the same target.
    // however, in order to avoid an infinite loop of Proxies triggering and re-triggering one another, we use dupProxy
    // to track that a given Proxy was modified from the 'set' handler
    let dupProxy = null;
    let _getProperty = function (obj, path) {
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
    let _create = function (target, domDelay, originalObservable, originalPath) {
        let autoDomDelay = domDelay == null;
        let observable = originalObservable || null;
        let path = originalPath || '';
        let changes = [];
        let _getPath = function (target, property) {
            if (target instanceof Array) {
                return (path !== '') ? (path) : property;
            }
            else {
                return (path !== '') ? (path + '.' + property) : property;
            }
        };
        let calls = 0;
        let _notifyObservers = function (numChanges) {
            if (observable.paused === true)
                return;
            // reset calls number after 10ms
            if (autoDomDelay) {
                domDelay = ++calls > 1;
                delay(function () {
                    calls = 0;
                });
            }
            //domDelay = false;
            // execute observer functions on a 10ms setTimeout, this prevents the observer functions from being executed
            // separately on every change -- this is necessary because the observer functions will often trigger UI updates
            if (domDelay === true /*&& !observable.disableDOMDelay*/) {
                delay(function () {
                    if (numChanges === changes.length) {
                        // invoke any functions that are observing changes
                        for (let i = 0; i < observable.observers.length; i++)
                            observable.observers[i](changes);
                        changes = [];
                    }
                });
            }
            else {
                // invoke any functions that are observing changes
                //console.log(numChanges, changes.length, observable.observers.length)
                //console.log(changes)
                for (let i = 0; i < observable.observers.length; i++)
                    observable.observers[i](changes);
                changes = [];
            }
        };
        let handler = {
            get: function (target, property) {
                // implement a simple check for whether or not the object is a proxy, this helps the .create() method avoid
                // creating Proxies of Proxies.
                if (property === '__getTarget') {
                    return target;
                }
                else if (property === '__isProxy') {
                    return true;
                    // from the perspective of a given observable on a parent object, return the parent object of the given nested object
                }
                else if (property === '__getParent') {
                    return function (i) {
                        if (typeof i === 'undefined')
                            i = 1;
                        let parentPath = _getPath(target, '__getParent').split('.');
                        parentPath.splice(-(i + 1), (i + 1));
                        return _getProperty(observable.parentProxy, parentPath.join('.'));
                    };
                }
                // return the full path of the current object relative to the parent observable
                else if (property === '__getPath') {
                    // strip off the 12 characters for ".__getParent"
                    let parentPath = _getPath(target, '__getParent');
                    return parentPath.slice(0, -12);
                }
                else if (property === 'prototype') {
                    return target[property];
                }
                // for performance improvements, we assign this to a variable so we do not have to lookup the property value again
                let targetProp = target[property];
                //console.log(targetProp instanceof Date)
                if (target instanceof Date && targetProp instanceof Function) {
                    return targetProp.bind(target);
                }
                // if we are traversing into a new object, then we want to record path to that object and return a new observable.
                // recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
                // the target object and any objects nested within.
                if ((targetProp instanceof Object) && target.hasOwnProperty(property)) {
                    // if we've found a proxy nested on the object, then we want to retrieve the original object behind that proxy
                    if (targetProp.__isProxy === true)
                        targetProp = targetProp.__getTarget;
                    // if we've previously setup a proxy on this target, then...
                    //let a = observable.targets.indexOf(targetProp);
                    //console.log('',a);
                    let a = -1;
                    let observableTargets = observable.targets;
                    for (let i = 0, l = observableTargets.length; i < l; i++) {
                        if (targetProp === observableTargets[i]) {
                            a = i;
                            break;
                        }
                    }
                    //console.log('get')
                    if (a > -1)
                        return observable.proxies[a];
                    // if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
                    // have to create a new proxy for it
                    let newPath = (path !== '') ? (path + '.' + property) : property;
                    return _create(targetProp, domDelay, observable, newPath);
                }
                else {
                    let value = observable.renderMode ? stringDecoder.encode(targetProp) : targetProp;
                    let manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, property, true);
                    }
                    return value;
                }
            },
            deleteProperty: function (target, property) {
                // was this change an original change or was it a change that was re-triggered below
                let originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }
                // in order to report what the previous value was, we must make a copy of it before it is deleted
                let previousValue = Object.assign({}, target);
                // get the path of the property being deleted
                let currentPath = _getPath(target, property);
                if (!observable.paused) {
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
                    //console.log('delete', changes)
                    if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
                        observable.checkBeforeChange = currentPath;
                        let res = observable.beforeChange(changes);
                        if (res === false) {
                            observable.checkBeforeChange = '';
                            return true;
                            //return false;
                        }
                    }
                    observable.checkBeforeChange = '';
                }
                if (originalChange === true) {
                    let a, l;
                    for (a = 0, l = targets.length; a < l; a++)
                        if (target === targets[a])
                            break;
                    // loop over each proxy and see if the target for this change has any other proxies
                    let currentTargetProxy = targetsProxy[a] || [];
                    let b = currentTargetProxy.length;
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
            set: function (target, property, value, receiver) {
                // was this change an original change or was it a change that was re-triggered below
                let originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }
                // improve performance by saving direct references to the property
                let targetProp = target[property];
                // only record a change if the new value differs from the old one OR if this proxy was not the original proxy to receive the change
                if (targetProp !== value || originalChange === false) {
                    //console.dir(target)
                    let typeOfTargetProp = (typeof targetProp);
                    // get the path of the object property being modified
                    let currentPath = _getPath(target, property);
                    // determine if we're adding something new or modifying some that already existed
                    let type = 'update';
                    if (typeOfTargetProp === 'undefined')
                        type = 'add';
                    let manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, currentPath, false);
                    }
                    // store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct
                    if (!observable.paused) {
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
                            let res = observable.beforeChange(changes);
                            if (res === false) {
                                observable.checkBeforeChange = '';
                                return true;
                                //return false;
                            }
                        }
                        observable.checkBeforeChange = '';
                    }
                    // !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
                    // if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
                    // observers can be modified of the change that has occurred.
                    if (originalChange === true) {
                        let a, l;
                        for (a = 0, l = targets.length; a < l; a++)
                            if (target === targets[a])
                                break;
                        // loop over each proxy and see if the target for this change has any other proxies
                        let currentTargetProxy = targetsProxy[a];
                        if (currentTargetProxy)
                            for (let b = 0, l = currentTargetProxy.length; b < l; b++) {
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
                        /*
                        setTimeout(function () {

                            if (typeOfTargetProp === 'object' && targetProp !== null) {

                                // check if the to-be-overwritten target property still exists on the target object
                                // if it does still exist on the object, then we don't want to stop observing it. this resolves
                                // an issue where array .sort() triggers objects to be overwritten, but instead of being overwritten
                                // and discarded, they are shuffled to a new position in the array
                                let keys = Object.keys(target);
                                for (let i = 0, l = keys.length; i < l; i++) {
                                    if (target[keys[i]] === targetProp) {
                                        //console.log('target still exists');
                                        return;
                                    }
                                }


                                let stillExists = false;

                                // now we perform the more expensive search recursively through the target object.
                                // if we find the targetProp (that was just overwritten) still exists somewhere else
                                // further down in the object, then we still need to observe the targetProp on this observable.
                                (function iterate(target) {
                                    const keys = Object.keys(target);
                                    let i = 0, l = keys.length;
                                    for (; i < l; i++) {

                                        const property = keys[i];
                                        const nestedTarget = target[property];

                                        if (nestedTarget instanceof Object) iterate(nestedTarget);
                                        if (nestedTarget === targetProp) {
                                            stillExists = true;
                                            return;
                                        }
                                    }
                                })(target);

                                // even though targetProp was overwritten, if it still exists somewhere else on the object,
                                // then we don't want to remove the observable for that object (targetProp)
                                if (stillExists === true) return;

                                // loop over each property and recursively invoke the `iterate` function for any
                                // objects nested on targetProp
                                (function iterate(obj) {

                                    let keys = Object.keys(obj);
                                    for (let i = 0, l = keys.length; i < l; i++) {
                                        let objProp = obj[keys[i]];
                                        if (objProp instanceof Object) iterate(objProp);
                                    }

                                    // if there are any existing target objects (objects that we're already observing)...
                                    //let c = targets.indexOf(obj);
                                    let c = -1;
                                    for (let i = 0, l = targets.length; i < l; i++) {
                                        if (obj === targets[i]) {
                                            c = i;
                                            break;
                                        }
                                    }
                                    if (c > -1) {

                                        // ...then we want to determine if the observables for that object match our current observable
                                        let currentTargetProxy = targetsProxy[c];
                                        let d = currentTargetProxy.length;

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
                                        if (currentTargetProxy.length === 0) {
                                            targets[c] = null;
                                            //targetsProxy.splice(c, 1);
                                            //targets.splice(c, 1);
                                        }
                                    }

                                })(targetProp)
                            }
                        }, 10000);
                        */
                        // because the value actually differs than the previous value
                        // we need to store the new value on the original target object
                        target[property] = value;
                        // TO DO: the next block of code resolves test case #24, but it results in poor IE11 performance. Find a solution.
                        // if the value we've just set is an object, then we'll need to iterate over it in order to initialize the
                        // observers/proxies on all nested children of the object
                        if (value instanceof Object && value !== null) {
                            (function iterate(proxy) {
                                let target = proxy.__getTarget;
                                let keys = Object.keys(target);
                                for (let i = 0, l = keys.length; i < l; i++) {
                                    let property = keys[i];
                                    if (target[property] instanceof Object && target[property] !== null)
                                        iterate(proxy[property]);
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
        let proxy = new Proxy(target, handler);
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
        }
        else {
            observable.targets.push(target);
            observable.proxies.push(proxy);
        }
        // store the proxy we've created so it isn't re-created unnecessary via get handler
        let proxyItem = { target, proxy, observable };
        //let targetPosition = targets.indexOf(target);
        let targetPosition = -1;
        for (let i = 0, l = targets.length; i < l; i++) {
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
        }
        else {
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
         * @param iterateBeforeCreate
         * @returns {Object}
         */
        create: function (target, domDelay, observer, iterateBeforeCreate) {
            // test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
            // we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
            if (target.__isProxy === true) {
                target = target.__getTarget;
                //if it is, then we should throw an error. we do not allow creating proxies of proxies
                // because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
                //throw new Error('ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.');
            }
            // fire off the _create() method -- it will create a new observable and proxy and return the proxy
            let proxy = _create(target, domDelay);
            // assign the observer function
            if (typeof observer === 'function')
                this.observe(proxy, observer);
            // recursively loop over all nested objects on the proxy we've just created
            // this will allow the top observable to observe any changes that occur on a nested object
            (function iterate(proxy) {
                let target = proxy.__getTarget;
                let keys = Object.keys(target);
                for (let i = 0, l = keys.length; i < l; i++) {
                    let property = keys[i];
                    if (typeof iterateBeforeCreate === 'function') {
                        iterateBeforeCreate(target, property);
                    }
                    if (target[property] instanceof Object && target[property] !== null)
                        iterate(proxy[property]);
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
        observe: function (proxy, observer) {
            // loop over all the observables created by the _create() function
            let i = observables.length;
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
        remove: function (proxy) {
            let matchedObservable = null;
            let foundMatch = false;
            let c = observables.length;
            while (c--) {
                if (observables[c].parentProxy === proxy) {
                    matchedObservable = observables[c];
                    foundMatch = true;
                    break;
                }
            }
            let a = targetsProxy.length;
            while (a--) {
                let b = targetsProxy[a].length;
                while (b--) {
                    if (targetsProxy[a][b].observable === matchedObservable) {
                        targetsProxy[a].splice(b, 1);
                        if (targetsProxy[a].length === 0) {
                            // if there are no more proxies for this target object
                            // then we null out the position for this object on the targets array
                            // since we are essentially no longer observing this object.
                            // we do not splice it off the targets array, because if we re-observe the same
                            // object at a later time, the property __targetPosition cannot be redefined.
                            targets[a] = null;
                            /*targetsProxy.splice(a, 1);
                            targets.splice(a, 1);*/
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
        manipulate: function (proxy, callback) {
            if (typeof callback !== 'function')
                throw new Error('callback is required');
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].manipulate = callback;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * beforeChange
         * @description This method accepts a function will be invoked before changes.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        beforeChange: function (proxy, callback) {
            if (typeof callback !== 'function')
                throw new Error('callback is required');
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].beforeChange = callback;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * beginRender
         * @description This method set renderMode to true so the param in get is sanitized.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        beginRender: function (proxy) {
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * endRender
         * @description This method set renderMode to false.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        endRender: function (proxy) {
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = false;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * disableDOMDelayBegin
         * @description This method set disableDOMDelay to true.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        /*disableDOMDelayBegin: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].disableDOMDelay = true;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
        },*/
        /**
         * disableDOMDelayEnd
         * @description This method set disableDOMDelay to false.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        /*disableDOMDelayEnd: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].disableDOMDelay = false;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
        },*/
        pause: function (proxy) {
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error("proxy not found.");
        },
        resume: function (proxy) {
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = false;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error("proxy not found.");
        }
    };
})();

function propsListener(instance, changes) {
    if (typeof instance.propsListener === 'object')
        for (let i = 0; i < changes.length; i++) {
            const item = changes[i];
            const propPath = instance.propsListener[item.currentPath];
            if (item.type === 'update' && propPath) {
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    func.call(instance, item.newValue, item.previousValue);
                }
            }
        }
    if (typeof instance.propsListenerAsync === 'object')
        for (let i = 0; i < changes.length; i++) {
            const item = changes[i];
            const propPath = instance.propsListenerAsync[item.currentPath];
            if (item.type === 'update' && propPath) {
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    (function (item) {
                        delay(() => func.call(instance, item.newValue, item.previousValue));
                    })(item);
                }
            }
        }
}

const types = {
    string(value) {
        if (typeof value === 'string')
            return value;
        return JSON.stringify(value);
    },
    number(value) {
        if (typeof value === 'number')
            return value;
        return Number(value);
    },
    boolean(value) {
        if (typeof value === 'boolean')
            return value;
        else if (value === 'true' || value === 1)
            return true;
        else if (value === 'false' || value === 0)
            return false;
        else {
            return !!value;
        }
    },
    object(value) {
        if (typeof value === 'object' && value)
            return value;
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    },
    array(value) {
        return this.object(value);
    },
    date(value) {
        if (value instanceof Date)
            return value;
        else
            return new Date(value);
    }
};
var castType = (function castType(value, type) {
    if (types[type] !== undefined) {
        value = types[type](value);
    }
    return value;
});

function manipulate(instance, value, currentPath, onFly, init) {
    if (typeof instance.propsType === 'object') {
        const type = instance.propsType[currentPath];
        if (type !== undefined) {
            value = castType(value, type);
        }
    }
    if (init) {
        onFly = instance.propsConvertOnFly;
    }
    if (instance.propsConvert && instance.propsConvertOnFly === onFly) {
        if (typeof instance.propsConvert === 'object') {
            const propPath = instance.propsConvert[currentPath];
            const func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                return func.call(instance, value);
            }
        }
    }
    if (init) {
        onFly = instance.propsComputedOnFly;
    }
    if (instance.propsComputed && instance.propsComputedOnFly === onFly) {
        if (typeof instance.propsComputed === 'object') {
            let cached = instance._computedCache.get(currentPath);
            if (cached === undefined) {
                cached = new Map();
                instance._computedCache.set(currentPath, cached);
            }
            else {
                const cachedValue = cached.get(value);
                if (cachedValue !== undefined) {
                    return cachedValue;
                }
            }
            const propPath = instance.propsComputed[currentPath];
            const func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                const result = func.call(instance, value);
                cached.set(value, result);
                return result;
            }
        }
    }
    return value;
}

function runUpdate(instance, changes) {
    hooks$1.callUpdate(instance, changes);
    propsListener(instance, changes);
    instance.render(undefined, changes);
}
function create$1(instance) {
    let recreate = false;
    if (instance._props && instance._props.__isProxy) {
        ObservableSlim.remove(instance._props);
        recreate = true;
    }
    instance._props = ObservableSlim.create(instance._rawProps, true, changes => {
        if (!instance._isRendered)
            return;
        if (instance.delayUpdate) {
            setTimeout(() => {
                runUpdate(instance, changes);
            }, instance.delayUpdate);
        }
        else {
            runUpdate(instance, changes);
        }
    }, (target, property) => {
        target[property] = manipulate(instance, target[property], property);
    });
    ObservableSlim.manipulate(instance._props, (value, currentPath, onFly) => {
        return manipulate(instance, value, currentPath, onFly);
    });
    ObservableSlim.beforeChange(instance._props, changes => {
        const res = hooks$1.callBeforeUpdate(instance, changes);
        if (res === false)
            return false;
    });
    if (recreate && instance._isRendered) {
        instance.render();
    }
}
var observer = {
    create: create$1
};

var isListener = (function isListener(str) {
    if (typeof str !== 'string')
        return false;
    return str[0] === 'o' && str[1] === 'n';
});

var makeSureAttach = (function ($target) {
    if ($target && !$target._dozAttach)
        $target._dozAttach = {};
});

var booleanAttributes = [
    'async',
    'autocomplete',
    'autofocus',
    'autoplay',
    'border',
    'challenge',
    'checked',
    'compact',
    'contenteditable',
    'controls',
    'default',
    'defer',
    'disabled',
    'formNoValidate',
    'frameborder',
    'hidden',
    'indeterminate',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'scrolling',
    'seamless',
    'selected',
    'sortable',
    'spellcheck',
    'translate'
];

function isEventAttribute(name) {
    return isListener(name);
}

function setAttribute($target, name, value, cmp, cmpParent, isSVG) {
    if (name === 'data-attributeoriginaletagname')
        return;

    makeSureAttach($target);

    if (!$target._dozAttach[PROPS_ATTRIBUTES]) {
        $target._dozAttach[PROPS_ATTRIBUTES] = {};
    }
    $target._dozAttach[PROPS_ATTRIBUTES][name] = value;
    if (name === 'key') {
        if ($target._dozAttach.key === undefined) {
            $target._dozAttach.key = value;
        }
        return;
    }
    let _isDirective = isDirective(name);
    if (_isDirective)
        $target._dozAttach.hasDirective = true;

    // solo se custom tag escludo tutti gli attributi tranne quelli esposti
    if ($target.tagName.indexOf('-') !== -1) {
        //console.log(cmp.exposeAttributes)
        if (!cmp.exposeAttributes.includes(name) && !name.startsWith('data-'))
           return;
    }

    if ((isCustomAttribute(name) || typeof value === 'function' || typeof value === 'object') && !_isDirective) ;
    else {
        if (value === undefined)
            value = '';
        if (name === 'class' && !isSVG) {
            $target.className = value;
            //Imposto solo se la proprietà esiste...
        }
        else if ($target[name] !== undefined && !isSVG) {
            //console.log(name, value, typeof value)
            // Support for boolean attributes like required, disabled etc..
            if (value === '') {
                if (booleanAttributes.indexOf(name) > -1)
                    value = true;
            }
            $target[name] = value;
        }
        else if (name.startsWith('data-')
            || name.startsWith('aria-')
            || name === 'role'
            || name === 'for'
            || isSVG
            || (cmp && cmp.app && cmp.app.setAllAttributes)
            || (window.SSR && !name.startsWith('d-'))
        ) {
            $target.setAttribute(name, value);
        }
    }
}
function updateAttribute($target, name, newVal, oldVal, cmp, cmpParent, isSVG) {
    //if (newVal !== oldVal) {
    setAttribute($target, name, newVal, cmp, cmpParent, isSVG);
    cmp.$$afterAttributeUpdate($target, name, newVal);
    //}
}
function updateAttributes($target, newProps, oldProps = {}, cmp, cmpParent, isSVG) {
    const props = Object.assign({}, newProps, oldProps);
    let updated = [];
    let propsKeys = Object.keys(props);
    let name;
    for (let i = 0; i < propsKeys.length; i++) {
        name = propsKeys[i];
        if (!$target || $target.nodeType !== 1)
            continue;
        if (newProps[name] !== oldProps[name]) {
            updateAttribute($target, name, newProps[name], oldProps[name], cmp, cmpParent, isSVG);
            let obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    }
    /*Object.keys(props).forEach(name => {
        if(!$target || $target.nodeType !== 1) return;
        updateAttribute($target, name, newProps[name], oldProps[name], cmp, cmpParent);
        if (newProps[name] !== oldProps[name]) {
            let obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    });*/
    return updated;
}
function isCustomAttribute(name) {
    return isEventAttribute(name) || name === ATTR.FORCE_UPDATE;
}
function extractEventName(name) {
    return name.slice(2).toLowerCase();
}
function addEventListener($target, name, value, cmp, cmpParent) {
    if (!isEventAttribute(name))
        return;
    //console.log('event attribute', name, value)
    let alreadyFunction = false;
    // Determines if the function is passed by mapper
    if (typeof value === 'function') {
        alreadyFunction = true;
    }
    // Legacy logic where use a string instead of function
    /*
    if (typeof value === 'string') {
        // If use scope. from onDrawByParent event
        let match = value.match(REGEX.GET_LISTENER_SCOPE);
        if (match) {
            let args = null;
            let handler = match[1];
            let stringArgs = match[2];
            if (stringArgs) {
                args = stringArgs.split(',').map(item => {
                    item = trimQuotes(item.trim());
                    return item === 'scope'
                        ? cmpParent
                        : item;
                });
            }
            const method = objectPath(handler, cmpParent);
            if (method !== undefined) {
                value = args
                    ? method.bind(cmpParent, ...args)
                    : method.bind(cmpParent);
            }
        }
        else {
            match = value.match(REGEX.GET_LISTENER);
            if (match) {
                //console.log('aaaaa')
                let args = null;
                let handler = match[1];
                let stringArgs = match[2];
                if (stringArgs) {
                    args = stringArgs.split(',').map(item => {
                        item = trimQuotes(item.trim());
                        return item === 'this'
                            ? cmp
                            : item;
                    });
                }
                let isParentMethod = handler.match(REGEX.IS_PARENT_METHOD);
                if (isParentMethod) {
                    handler = isParentMethod[1];
                    cmp = cmp.parent;
                }
                const method = objectPath(handler, cmp);
                if (method !== undefined) {
                    value = args
                        ? method.bind(cmp, ...args)
                        : method.bind(cmp);
                }
            }
        }
    }*/
    if (typeof value === 'function') {
        if (alreadyFunction) {
            $target.addEventListener(extractEventName(name), value.bind(cmp));
        }
        else {
            $target.addEventListener(extractEventName(name), value);
        }
    }
    else {
        value = value.replace(REGEX.THIS_TARGET, '$target');
        // I don't understand but with regex test sometimes it don't works fine so use match... boh!
        //if (REGEX.IS_LISTENER_SCOPE.test(value) || value === 'scope') {
        if (value.match(REGEX.IS_LISTENER_SCOPE) || value === 'scope') {
            const _func = function () {
                // Brutal replace of scope with this
                value = value.replace(/scope/g, 'this');
                eval(value);
            };
            $target.addEventListener(extractEventName(name), _func.bind(cmpParent));
        }
        else {
            const _func = function () {
                eval(value);
            };
            $target.addEventListener(extractEventName(name), _func.bind(cmp));
        }
    }
}
function attach($target, nodeProps, cmp, cmpParent, isSVG) {
    let name;
    //console.log($target, nodeProps)
    const propsKeys = Object.keys(nodeProps);
    for (let i = 0, len = propsKeys.length; i < len; i++) {
        name = propsKeys[i];
        //console.log(name, nodeProps[name])
        addEventListener($target, name, nodeProps[name], cmp, cmpParent);
        setAttribute($target, name, nodeProps[name], cmp, cmpParent, isSVG);
        if (cmp && cmp.app && cmp.app.emit) {
            cmp.app.emit('elementAttributesAttach', $target, name, nodeProps[name], cmp);
        }
    }
    /*const datasetArray = Object.keys($target.dataset);
    for (let i = 0; i < datasetArray.length; i++) {
        if (isListener(datasetArray[i]))
            addEventListener($target, datasetArray[i], $target.dataset[datasetArray[i]], cmp, cmpParent);
    }*/
}

function canDecode(str) {
    return /&\w+;/.test(str)
        ? html.decode(str)
        : str;
}

/*
// Add tag prefix to animation name inside keyframe
(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)

// Add tag prefix to animation
((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)
 */
//const mapper = require('../vdom/mapper');
function composeStyleInner(cssContent, tag, cmp) {
    if (typeof cssContent !== 'string')
        return;
    //cssContent = mapper.getAll(cssContent);
    let sanitizeTagForAnimation = tag.replace(/[^\w]/g, '');
    if (/:root/.test(cssContent)) {
        console.warn('[DEPRECATION] the :root pseudo selector is deprecated, use :component or :wrapper instead');
    }
    // se il componente non ha alcun tag allora imposto il tag per il selettore css a vuoto
    // questo accade quando si usa Doz.mount il quale "monta" direttamente il componente senza il wrapper "dz-app"
    /*if (cmp && cmp.tag === undefined) {
        tag = '';

        if (cmp.app.isWebComponent && cmp.app.byAppCreate) {
            cssContent = cssContent
                .replace(/:(component|wrapper|root)/g, ':host')
        }
    }*/
    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/^(\s+)?:(component|wrapper|root)(\s+)?{/gm, tag + ' {')
        .replace(/:(component|wrapper|root)/g, '')
        .replace(/(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        .replace(/((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
        .replace(/[^\s].*{/gm, match => {
        if (/^(@|:host|(from|to|\d+%)[^-_])/.test(match))
            return match;
        let part = match.split(',');
        const sameTag = new RegExp(`^${tag.replace(/[[\]]/g, '\\$&')}(\\s+)?{`);
        for (let i = 0; i < part.length; i++) {
            part[i] = part[i].trim();
            if (sameTag.test(part[i]))
                continue;
            if (/^:global/.test(part[i]))
                part[i] = part[i].replace(':global', '');
            else
                part[i] = `${tag} ${part[i]}`;
        }
        match = part.join(',');
        return match;
    });
    cssContent = cssContent
        .replace(/\s{2,}/g, ' ')
        .replace(/{ /g, '{')
        .replace(/ }/g, '}')
        .replace(/\s:/g, ':') //remove space before pseudo classes
        .replace(/\n/g, '')
        .trim();
    return cssContent;
}

var tagList = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'bdi',
    'bdo',
    'blockquote',
    //'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'command',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    //'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'keygen',
    'label',
    'legend',
    'li',
    'main',
    'map',
    'mark',
    'menu',
    'meter',
    'nav',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'tr',
    'track',
    'u',
    'ul',
    'var',
    'video',
    'wbr'
];

function createStyle(cssContent, uId, tag, scoped, cmp) {
    let result;
    const styleId = `${uId}--style`;
    const styleResetId = `${uId}--style-reset`;
    //const styleExists = document.getElementById(styleId);
    let styleExists;
    if (cmp && cmp.app.useShadowRoot) {
        styleExists = cmp.app._root.getElementById(styleId);
    }
    else {
        styleExists = document.getElementById(styleId);
    }
    if (styleExists) {
        result = styleExists.innerHTML = cssContent;
    }
    else {
        if (scoped) {
            let resetContent = `${tag}, ${tag} *,`;
            resetContent += tagList.map(t => `${tag} ${t}`).join(',');
            resetContent += ` {all: initial}`;
            const styleResetEl = document.createElement("style");
            styleResetEl.id = styleResetId;
            styleResetEl.innerHTML = resetContent;
            if (cmp && cmp.app.useShadowRoot) {
                let tagApp = cmp.app._root.querySelector(TAG.APP);
                cmp.app._root.insertBefore(styleResetEl, tagApp);
            }
            else {
                document.head.appendChild(styleResetEl);
            }
        }
        const styleEl = document.createElement("style");
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        if (cmp && cmp.app.useShadowRoot) {
            let tagApp = cmp.app._root.querySelector(TAG.APP);
            cmp.app._root.insertBefore(styleEl, tagApp);
        }
        else {
            document.head.appendChild(styleEl);
        }
    }
    return result;
}

function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string')
        return;
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}

//const {kCache} = require('./stores');
const storeElementNode = Object.create(null);
const deadChildren = [];

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial, cmpParent) {
    //console.log(node)
    if (typeof node === 'undefined' || Array.isArray(node) && node.length === 0)
        return;
    let nodeStored;
    let $el;
    //let originalTagName;
    if (typeof node !== 'object') {
        return document.createTextNode(
        // use decode only if necessary
        canDecode(node));
    }
    if (!node || node.type == null || node.type[0] === '#') {
        node = { type: TAG.EMPTY, props: {}, children: [] };
    }
    if (node.props && node.props.slot && !node.isNewSlotEl) {
        return document.createComment(`slot(${node.props.slot})`);
    }
    //console.log(node.type, node.props, cmp.tag)
    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    }
    else {
        //originalTagName = node.props['data-attributeoriginaletagname'];
        $el = node.isSVG
            ? document.createElementNS(NS.SVG, node.type)
            : document.createElement(node.type);
        storeElementNode[node.type] = $el.cloneNode(true);
    }
    //console.log(node);
    attach($el, node.props, cmp, cmpParent, node.isSVG);
    // The children with keys will be created later
    if (!node.hasKeys) {
        if (!node.children.length) ;
        else if (node.children.length === 1 && typeof node.children[0] === 'string') {
            //console.log('node.children[0]', node.children[0])
            $el.textContent = canDecode(node.children[0]);
        }
        else {
            for (let i = 0; i < node.children.length; i++) {
                let $childEl = create(node.children[i], cmp, initial, cmpParent);
                if ($childEl) {
                    $el.appendChild($childEl);
                }
            }
        }
    }
    makeSureAttach($el);
    $el._dozAttach.elementChildren = node.children;
    $el._dozAttach.originalTagName = node.props['data-attributeoriginaletagname'];
    cmp.$$afterNodeElementCreate($el, node, initial, cmp);
    // Create eventually style
    if (node.style) {
        setHeadStyle(node, cmp);
    }
    return $el;
}

function setHeadStyle(node, cmp) {
    cmp.__hasStyle = true;
    let isScoped = node.styleScoped;
    const dataSetUId = cmp.uId;
    let tagByData = `[data-uid="${dataSetUId}"]`;
    scopedInner(node.style, dataSetUId, tagByData, isScoped, cmp);
}
//let xy = 0;
function update($parent, newNode, oldNode, index = 0, cmp, initial, cmpParent) {
    //directive.callComponentVNodeTick(cmp, newNode, oldNode);
    //console.log('a')
    //console.log(newNode)
    /*if (newNode === oldNode && $parent._dozAttach && $parent._dozAttach.componentRootInstance) {
        //console.log('uguali', newNode.type, $parent._dozAttach.componentRootInstance)
        console.log('uguali', newNode.type, cmpParent)
    }*/
    // For the moment I exclude the check on the comparison between newNode and oldNode
    // only if the component is DZ-MOUNT because the slots do not work
    if (!$parent || (newNode === oldNode && cmp.tag !== TAG.MOUNT))
        return;
    if (cmp && cmp.app && cmp.app.onVdomUpdateElement) {
        let resultVdomUpdateElement = cmp.app.onVdomUpdateElement($parent, newNode, oldNode, cmp, initial, cmpParent);
        if (resultVdomUpdateElement) {
            $parent = resultVdomUpdateElement.$parent || $parent;
            newNode = resultVdomUpdateElement.newNode || newNode;
            oldNode = resultVdomUpdateElement.oldNode || oldNode;
            cmp = resultVdomUpdateElement.cmp || cmp;
        }
    }
    if (newNode && newNode.cmp)
        cmp = newNode.cmp;
    // Update style
    if (newNode && oldNode && newNode.style !== oldNode.style) {
        setHeadStyle(newNode, cmp);
    }
    //console.log(JSON.stringify(newNode, null, 4))
    if (cmpParent && $parent._dozAttach[COMPONENT_INSTANCE]) {
        let result = hooks$1.callDrawByParent($parent._dozAttach[COMPONENT_INSTANCE], newNode, oldNode);
        if (result !== undefined && result !== null && typeof result === 'object') {
            newNode = result.newNode || newNode;
            oldNode = result.oldNode || oldNode;
        }
        // Slot logic
        let propsSlot = newNode && newNode.props ? newNode.props.slot : false;
        if ($parent._dozAttach[COMPONENT_INSTANCE]._defaultSlot && !propsSlot) {
            propsSlot = DEFAULT_SLOT_KEY;
        }
        if (typeof newNode === 'object' && propsSlot && $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot]) {
            //console.log(newNode === oldNode)
            //console.log(JSON.stringify(newNode, null, 4))
            $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot].forEach($slot => {
                // Slot is on DOM
                if ($slot.parentNode) {
                    newNode.isNewSlotEl = true;
                    let $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                    $newElement.removeAttribute('slot');
                    // I must replace $slot element with $newElement
                    $slot.parentNode.replaceChild($newElement, $slot);
                    // Assign at $slot a property that referred to $newElement
                    $slot.__newSlotEl = $newElement;
                }
                else {
                    // Now I must update $slot.__newSlotEl using update function
                    // I need to known the index of newSlotEl in child nodes list of his parent
                    let indexNewSlotEl = Array.from($slot.__newSlotEl.parentNode.children).indexOf($slot.__newSlotEl);
                    update($slot.__newSlotEl.parentNode, newNode, oldNode, indexNewSlotEl, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                }
            });
            return;
        }
    }
    // la proprietà data-follow="qualcosa" ci permette di aggiornare il nodo corretto qualora questo fosse spostato nel dom
    if (newNode && newNode.props && newNode.props['data-follow']) {
        //console.log('trovato');
        let followElement = document.querySelector(`[data-follow="${newNode.props['data-follow']}"]`);
        if (followElement && followElement.parentElement) {
            $parent = followElement.parentElement;
            makeSureAttach($parent);
            //console.log($parent);
        }
    }
    if (!oldNode) {
        //if (oldNode === undefined || oldNode == null) {
        //console.log('create node', newNode.type);
        // create node
        let $newElement;
        if ($parent.childNodes.length) {
            // If last node is a root, insert before
            let $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
            makeSureAttach($lastNode);
            if ($lastNode._dozAttach[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $parent.insertBefore($newElement, $lastNode);
                return $newElement;
            }
        }
        makeSureAttach($parent);
        $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        //console.log('append to', $parent, cmp.uid);
        $parent.appendChild($newElement);
        return $newElement;
    }
    else if (!newNode) {
        //} else if (newNode === undefined || newNode == null) {
        //console.log('remove node', $parent);
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    }
    else if (isChanged(newNode, oldNode)) {
        //console.log('newNode changes', newNode);
        //console.log('oldNode changes', oldNode);
        // node changes
        const $oldElement = $parent.childNodes[index];
        if (!$oldElement)
            return;
        const canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement)
            return canReuseElement;
        const $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        //console.log(newNode.type, oldNode.type)
        $parent.replaceChild($newElement, $oldElement);
        cmp.$$afterNodeChange($newElement, $oldElement);
        // Provo a cancellare eventuale istanza
        if ($oldElement._dozAttach && $oldElement._dozAttach[COMPONENT_INSTANCE]) {
            $oldElement._dozAttach[COMPONENT_INSTANCE].unmount();
            $oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
        }
        return $newElement;
    }
    else if (newNode.hasKeys !== undefined || oldNode.hasKeys !== undefined) {
        //console.log('key')
        // Children could be keys.
        // Every time there are update operation of the list should be enter here.
        // These operations are done only for the first level of nodes for example
        // <ul>
        //      <li>other1</li>
        //      <li>other2</li>
        //      <li>other3</li>
        // </ul>
        // Only the "LI" tags will be processed with this algorithm.
        // The content of the "LI" tag will be processed by the normal "update" function
        let $myListParent = $parent.childNodes[index];
        // console.log(newNode.type, $myListParent);
        let newNodeKeyList = newNode.children.map(i => i.key);
        let oldNodeKeyList = oldNode.children.map(i => i.key);
        // here my new logic for keys
        // Check if $myListParent has _dozAttach.keyList
        if ($myListParent._dozAttach.keyList === undefined) {
            $myListParent._dozAttach.keyList = new Map();
        }
        let oldKeyDoRemove = oldNodeKeyList.filter(x => !newNodeKeyList.includes(x));
        //console.log('diff', oldKeyDoRemove)
        // Ci sono key da rimuovere?
        for (let i = 0; i < oldKeyDoRemove.length; i++) {
            if ($myListParent._dozAttach.keyList.has(oldKeyDoRemove[i])) {
                let $oldElement = $myListParent._dozAttach.keyList.get(oldKeyDoRemove[i]);
                //console.log('da rimuovere', $oldElement);
                if ($oldElement._dozAttach[COMPONENT_INSTANCE]) {
                    $oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
                }
                else {
                    $myListParent.removeChild($oldElement);
                }
                $myListParent._dozAttach.keyList.delete(oldKeyDoRemove[i]);
                cmp.app.cacheStores.kCache.delete(oldKeyDoRemove[i]);
                //console.log('cancellato in posizione', oldKeyDoRemove[i], i)
            }
        }
        //console.log(oldKeyDoRemove)
        //console.log(newNodeKeyList)
        if (oldKeyDoRemove.length) {
            // Remove from old the removed keys so preventing diff position
            oldNodeKeyList = oldNodeKeyList.filter(x => !~oldKeyDoRemove.indexOf(x));
        }
        let listOfElement = [];
        let diffIndex = [];
        let diffIndexMap = Object.create(null);
        for (let i = 0; i < newNodeKeyList.length; i++) {
            if (newNodeKeyList[i] !== oldNodeKeyList[i]) {
                //console.log('indice diverso ', i)
                diffIndex.push(i);
                diffIndexMap[i] = true;
            }
            // This is the key of all
            let theKey = newNodeKeyList[i];
            // console.log('esiste nella mappa?', newNode.children[i].props.key,$myListParent._dozAttach.keyList.has(newNode.children[i].props.key))
            let $element = $myListParent._dozAttach.keyList.get(theKey);
            // Se non esiste creo il nodo
            if (!$element) {
                let $newElement = create(newNode.children[i], cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $myListParent._dozAttach.keyList.set(theKey, $newElement);
                // console.log('elemento creato', $newElement);
                // appendo per il momento
                listOfElement.push($newElement);
            }
            else {
                // Get the child from newNode and oldNode by the same key
                let _kCacheValue = cmp.app.cacheStores.kCache.get(theKey);
                let newChildByKey = _kCacheValue.next;
                let oldChildByKey = _kCacheValue.prev;
                if (!newChildByKey.children)
                    newChildByKey.children = [];
                if (!oldChildByKey.children)
                    oldChildByKey.children = [];
                listOfElement.push($element);
                if (_kCacheValue.isChanged) {
                    // Update attributes?
                    // Remember that the operation must be on the key and not on the index
                    updateAttributes($element, newChildByKey.props, oldChildByKey.props, cmp, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent, newChildByKey.isSVG);
                    // Here also update function using the key
                    // update(...
                }
                const newChildByKeyLength = newChildByKey.children.length;
                const oldChildByKeyLength = oldChildByKey.children.length;
                //console.log(diffIndex)
                for (let i = 0; i < newChildByKeyLength || i < oldChildByKeyLength; i++) {
                    if (newChildByKey.children[i] === undefined || oldChildByKey.children[i] === undefined)
                        continue;
                    //console.log(newChildByKey.children[i])
                    //console.log(oldChildByKey.children[i])
                    update($element, newChildByKey.children[i], oldChildByKey.children[i], i, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                }
            }
        }
        //console.log(diffIndex);
        // No differences so exit or items are removed
        if (diffIndex[0] === undefined /*|| oldKeyDoRemove.length*/)
            return;
        // If first item index is equal to childNodes length then just append..
        if ($myListParent.childNodes.length === diffIndex[0]) {
            //let fragmentEl = document.createDocumentFragment();
            for (let i = 0; i < listOfElement.length; i++) {
                $myListParent.appendChild(listOfElement[i]);
            }
            return;
        }
        //return ;
        let useIndexI = true;
        let $currentElementAtPosition;
        let $element;
        let i = 0;
        let j = listOfElement.length - 1;
        // Try to reorder the list...
        while (i <= j) {
            //console.log(i)
            if (useIndexI) {
                $currentElementAtPosition = $myListParent.childNodes[i];
                $element = listOfElement[i];
                if (diffIndexMap[i]) {
                    //if (diffIndex.indexOf(i) > -1) {
                    if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== i) {
                        //console.log('MOVE I, ', i)
                        $myListParent.insertBefore($element, $currentElementAtPosition);
                        useIndexI = false;
                    }
                }
                i++;
            }
            else {
                $currentElementAtPosition = $myListParent.childNodes[j];
                $element = listOfElement[j];
                if (diffIndexMap[j]) {
                    //if (diffIndex.indexOf(j) > -1) {
                    if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== j) {
                        //console.log('MOVE J, ', j)
                        if ($currentElementAtPosition)
                            $myListParent.insertBefore($element, $currentElementAtPosition.nextSibling);
                        else {
                            $myListParent.appendChild($element);
                            j++;
                        }
                        useIndexI = true;
                    }
                }
                j--;
            }
        }
        //console.log('$myListParent ', Array.from($myListParent.childNodes).map(item => item._dozAttach.key))
        //console.log('----------------');
    }
    else if (newNode.type) {
        //console.log('walk node', newNode.type)
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
        if ($parent._dozAttach[COMPONENT_INSTANCE] === cmp && $parent.childNodes.length) {
            // subtract 1 (should be dz-root) to child nodes length
            // check if last child node is a root of the component
            let lastIndex = $parent.childNodes.length - 1;
            if ($parent.childNodes[lastIndex]._dozAttach && $parent.childNodes[lastIndex]._dozAttach[COMPONENT_ROOT_INSTANCE])
                index += lastIndex;
        }
        let attributesUpdated = updateAttributes($parent.childNodes[index], newNode.props, oldNode.props, cmp, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent, newNode.isSVG);
        if (cmp.$$beforeNodeWalk($parent, index, attributesUpdated))
            return;
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            update($parent.childNodes[index], newNode.children[i], oldNode.children[i], i, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        }
        clearDead();
    }
}
function clearDead() {
    let dl = deadChildren.length;
    while (dl--) {
        deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        if (deadChildren[dl]._dozAttach && deadChildren[dl]._dozAttach[COMPONENT_INSTANCE]) {
            deadChildren[dl]._dozAttach[COMPONENT_INSTANCE].unmount();
            deadChildren[dl]._dozAttach[COMPONENT_INSTANCE].destroy();
        }
        deadChildren.splice(dl, 1);
    }
}
var element = {
    create,
    update
};

const updateElement = element.update;

function camelToDash(s) {
    return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

function toInlineStyle(obj, withStyle = true) {
    obj = Object.entries(obj).reduce((styleString, [propName, propValue]) => {
        return `${styleString}${camelToDash(propName)}:${propValue};`;
    }, '');
    return withStyle ? `style="${obj}"` : obj;
}

function add$1(instance) {
    //console.log('----->', instance.__proto__.constructor.__postListeners)
    let instanceProto = instance.__proto__;
    if (typeof instance.onAppReady === 'function') {
        instance.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.onAppReady);
    }
    else if (instanceProto &&
        instanceProto.constructor &&
        instanceProto.constructor.__postListeners &&
        instanceProto.constructor.__postListeners.onAppReady) {
        instanceProto.constructor.__postListeners.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instanceProto.constructor.__postListeners.onAppReady);
    }
}
var queueReady = {
    add: add$1
};

function add(instance) {
    if (typeof instance.onAppDraw === 'function') {
        instance.onAppDraw._instance = instance;
        instance.app._onAppDrawCB.push(instance.onAppDraw);
    }
}
function emit(instance, next, prev) {
    instance.app._onAppDrawCB.forEach(cb => {
        if (typeof cb === 'function' && cb._instance) {
            cb.call(cb._instance, next, prev, instance);
        }
    });
}
var queueDraw = {
    add,
    emit
};

function extendInstance(instance, cfg, dProps) {
    //console.log(cfg, dProps)
    Object.assign(instance, cfg, dProps);
}

function deepCopy(obj) {
    // if not array or object or is null return self
    if (typeof obj !== 'object' || obj === null)
        return obj;
    let newObj, i;
    // handle case: array
    if (Array.isArray(obj)) {
        let l;
        newObj = [];
        for (i = 0, l = obj.length; i < l; i++)
            newObj[i] = deepCopy(obj[i]);
        return newObj;
    }
    // handle case: object
    newObj = {};
    for (i in obj)
        if (obj.hasOwnProperty(i)) {
            //if (obj[i] === undefined)
            //console.log(i, obj[i])
            newObj[i] = deepCopy(obj[i]);
        }
    return newObj;
}

const tagText = TAG.TEXT_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';
const PLACEHOLDER_REGEX_GLOBAL = /e-0_(\d+)_0-e/g;
const PLACEHOLDER_REGEX = /e-0_(\d+)_0-e/;
function placeholderIndex(str, values) {
    //console.log(str)
    if (typeof str !== 'string') {
        return str;
    }
    if (str[0] === 'e' && str[1] === '-') {
        let match = PLACEHOLDER_REGEX.exec(str);
        if (match) {
            // if is a possible text node
            if (match[1][0] === '0' && match[1].length >= 2) {
                // remove first fake 0 that identify a text node and cast to string every
                return values[match[1].substr(1)] + '';
            }
            else {
                return values[match[1]];
            }
        }
        else
            return str;
    }
    else {
        return str.replace(PLACEHOLDER_REGEX_GLOBAL, (match, p1) => {
            if (p1) {
                return values[p1];
            }
            else {
                return match;
            }
        });
    }
}
function generateItemKey(values) {
    let key = '';
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== 'function' && typeof values[i] !== 'object') {
            key += values[i];
        }
    }
    //console.log(key);
    return key;
}
function fillCompiled(obj, values, parent, _this) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        //for (let k in obj) {
        if (obj[keys[i]] && typeof obj[keys[i]] === 'object') {
            fillCompiled(obj[keys[i]], values, obj, _this);
        }
        else {
            //console.log(i, keys[i])
            let value = placeholderIndex(obj[keys[i]], values);
            //if (typeof value === 'function' && keys[i] === 'type') {
            if ('type' === keys[i] && 'string' !== typeof value) {
                let cmp = value || {};
                let tagName = camelToDash(cmp.tag || cmp.name || TAG.ROOT);
                // Sanitize tag name
                tagName = tagName.replace(/_+/, '');
                // if is a single word, rename with double word
                if (tagName.indexOf('-') === -1) {
                    tagName = `${tagName}-${tagName}`;
                }
                let tagCmp = tagName + '-' + _this.uId + '-' + (_this._localComponentLastId++);
                if (_this._componentsMap.has(value)) {
                    tagCmp = _this._componentsMap.get(value);
                }
                else {
                    _this._componentsMap.set(value, tagCmp);
                }
                // add to local components
                if (_this._components[tagCmp] === undefined) {
                    _this._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }
                // add to local app components
                if (_this.app._components[tagCmp] === undefined) {
                    _this.app._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }
                value = tagName;
                obj.props['data-attributeoriginaletagname'] = tagCmp;
            }
            if (Array.isArray(value) && keys[i] === '0') {
                parent.children = value;
                if (value[0] && value[0].key !== undefined)
                    parent.hasKeys = true;
            }
            else {
                // questo evita stringhe vuote che potrebbero causare visualizzazioni errate
                if (value === '' && keys[i] === '0') {
                    value = ' ';
                }
                obj[keys[i]] = value;
            }
        }
    }
}
var h = (function (strings, ...values) {
    let hCache;
    let kCache;
    let isStyleForWebComponentByAppCreate;
    // use internal app cache stores
    if (this && this.app) {
        hCache = this.app.cacheStores.hCache;
        kCache = this.app.cacheStores.kCache;
        isStyleForWebComponentByAppCreate = this.app.isWebComponent && this._mainComponentByAppCreate;
    }
    else {
        // use global cache stores
        hCache = cacheStores.hCache;
        kCache = cacheStores.kCache;
    }
    let tpl = hCache.get(strings);
    //console.log(this.app.appIntId);
    //console.log(strings);
    //let appIntId = this.app.appIntId;
    if (!tpl) {
        //console.log(strings[0])
        tpl = strings[0];
        let allowTag = false;
        let isInStyle = false;
        let thereIsStyle = false;
        let valueLength = values.length;
        for (let i = 0; i < valueLength; ++i) {
            let stringsI = strings[i];
            let stringLength = stringsI.length;
            let lastChar = stringsI[stringLength - 1];
            for (let x = 0; x < stringLength; x++) {
                if (stringsI[x] === LESSER) {
                    allowTag = false;
                }
                else if (stringsI[x] === GREATER) {
                    allowTag = true;
                }
            }
            if (stringsI.indexOf('<style') > -1) {
                isInStyle = true;
                thereIsStyle = true;
            }
            if (stringsI.indexOf('</style') > -1) {
                isInStyle = false;
            }
            if (thereIsStyle && isStyleForWebComponentByAppCreate) {
                tpl = tpl
                    .replace(/<style>/, '<style data-is-webcomponent>');
            }
            if (isInStyle) {
                allowTag = false;
                tpl = tpl
                    .replace(/ scoped>/, ' data-scoped>');
            }
            if (allowTag) {
                if (typeof values[i] === 'object' || typeof values[i] === 'function') {
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                }
                else {
                    // Questo serve ad evitare che "oldNode" o "newNode" siano stringhe vuote
                    // dal momento che se un placeholder allora anche il suo corrispettivo
                    // nodo di testo dev'essere creato o modificato.
                    // Senza questo eventuali strighe vuote potevano non essere considerate.
                    if (values[i] === '') {
                        values[i] = ' ';
                    }
                    // possible html as string
                    if (/<.*>/.test(values[i])) {
                        tpl += `${values[i]}${strings[i + 1]}`;
                    }
                    else {
                        // add a fake 0 before index useful to identify a text node so cast to string every
                        tpl += `<${tagText}>e-0_0${i}_0-e</${tagText}>${strings[i + 1]}`;
                    }
                }
            }
            else {
                // Gestico eventuale caso di chiusura tag con placeholder
                // tipo: </${FooBar}>
                if (lastChar === '/') {
                    tpl += strings[i + 1];
                }
                else {
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                }
            }
        }
        tpl = tpl.trim();
        hCache.set(strings, tpl);
    }
    //console.log('TPL ------>', tpl)
    let cloned;
    let model = compile(tpl);
    let clonedKey;
    if (model.props.forceupdate) {
        hCache.delete(strings);
    }
    if (model.key !== undefined || model.props['item-list'] !== undefined) {
        //clonedKey = values.filter(item => typeof item !== 'function' && typeof item !== 'object').join('');
        clonedKey = generateItemKey(values);
        cloned = clonedKey ? hCache.get(clonedKey) : undefined;
    }
    if (!cloned) {
        cloned = deepCopy(model);
        fillCompiled(cloned, values, null, this);
        if (clonedKey) {
            hCache.set(clonedKey, cloned);
        }
    }
    if (model.key !== undefined) {
        let _kCacheValue = kCache.get(cloned.key);
        if (_kCacheValue /*&& clonedKey !== _kCacheValue.clonedKey*/) {
            kCache.set(cloned.key, {
                isChanged: clonedKey !== _kCacheValue.clonedKey,
                //isChanged: true,
                clonedKey,
                next: cloned,
                prev: _kCacheValue.next
            });
        }
        else {
            kCache.set(cloned.key, {
                isChanged: true,
                clonedKey,
                next: cloned,
                prev: {}
            });
        }
    }
    //console.log('CLN ------>', cloned)
    return cloned;
});

function loadLocal(instance) {
    // Add local components
    if (Array.isArray(instance.components)) {
        instance.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                instance._components[cmp.tag] = cmp;
            }
        });
        delete instance.components;
    }
    else if (typeof instance.components === 'object') {
        Object.keys(instance.components).forEach(objName => {
            instance._components[objName] = {
                tag: objName,
                cfg: instance.components[objName]
            };
        });
        delete instance.components;
    }
}

function mixin(target, sources = []) {
    if (typeof target !== 'object' || target == null) {
        throw new TypeError('expected an object');
    }
    if (!Array.isArray(sources)) {
        sources = [sources];
    }
    for (let j = sources.length - 1; j >= 0; --j) {
        let keys = Object.keys(sources[j]);
        for (let i = keys.length - 1; i >= 0; --i) {
            let index = keys[i];
            if (typeof target[index] === 'undefined') {
                target[index] = sources[j][index];
            }
            else {
                console.warn('Doz', `mixin failed for already defined property: ${index}`);
            }
        }
    }
    return target;
}

function localMixin(instance) {
    mixin(instance, instance.mixin);
    instance.mixin = [];
}

function propsInit(instance) {
    (function iterate(props) {
        let keys = Object.keys(props);
        for (let i = 0, l = keys.length; i < l; i++) {
            let property = keys[i];
            if (props[property] instanceof Object && props[property] !== null) {
                iterate(props[property]);
            }
            else {
                props[property] = manipulate(instance, props[property], property, false, true);
            }
        }
    })(instance._rawProps);
}

function doCreateInstance(instance, $el) {
    //console.log('creo instance', $el.outerHTML)
    let dynamicInstance = createInstance({
        root: null,
        template: $el,
        app: instance.app,
        parent: instance
    });

    if (dynamicInstance && dynamicInstance._rootElement) {
        dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
    }
}

class DOMManipulation extends Base {
    constructor(opt) {
        super(opt);
    }
    $$afterNodeElementCreate($el, node, initial, cmp) {
        if ($el._dozAttach.hasDirective) {
            directives.callAppDOMElementCreate(this, $el, node, initial);
            directives.callComponentDOMElementCreate(this, $el, initial);
        }
        //console.log('element created', $el.outerHTML)
        //this._canWalk = false;
        //console.log('NODO CREATO', $el.nodeName, 'da elaborare:', node.type.indexOf('-') !== -1,  'fa parte di:', this.tag);
        //console.log('......', $el.nodeName)
        if (typeof $el.hasAttribute === 'function') {
            if (node.type.indexOf('-') !== -1) {

                //this.childrenToWalk.push($el)
                //this._processing.push({ node: $el, action: 'create' });
                //if (!initial) {
                    //console.log('NODO PER COMPONENT', $el.nodeName, initial)
                    doCreateInstance(this, $el);
                //}
            }

            if ($el.nodeName === TAG.SLOT_UPPERCASE) {
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
        directives.callComponentDOMElementUpdate(this, $target);
        //if ($target && REGEX.IS_DIRECTIVE.test(name)) {
        if ($target && _isDirective) {
            $target.removeAttribute(name);
        }
    }
}

function toLiteralString(str) {
    return str
        .replace(/{{/gm, '${')
        .replace(/}}/gm, '}');
}

//const mapCompiled = require('../vdom/map-compiled');

class Component extends DOMManipulation {
    constructor(opt) {
        super(opt);
        this._isSubclass = this.__proto__.constructor !== Component;
        this.uId = this.app.generateUId();
        this.h = h.bind(this);
        /*Object.defineProperty(this, '_isSubclass', {
            value: this.__proto__.constructor !== Component
        });
        Object.defineProperty(this, 'uId', {
            value: this.app.generateUId(),
            enumerable: true
        });
        Object.defineProperty(this, 'h', {
            value: h.bind(this),
            enumerable: false
        });*/
        this._initRawProps(opt);
        // Assign cfg to instance
        extendInstance(this, opt.cmp.cfg);
        // Create mixin
        localMixin(this);
        // Load local components
        loadLocal(this);
        const beforeCreate = hooks$1.callBeforeCreate(this);
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
        hooks$1.callCreate(this);
    }
    set props(props) {
        if (typeof props === 'function')
            props = props();
        this._rawProps = Object.assign({}, props, this._opt ? this._opt.props : {});
        observer.create(this);
        directives.callAppComponentSetProps(this);
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
        hooks$1.callLoadProps(this);
    }
    set config(obj) {
        if (!this._isSubclass)
            throw new Error('Config is allowed only for classes');
        if (this._configured)
            throw new Error('Already configured');
        if (typeof obj !== 'object')
            throw new TypeError('Config must be an object');
        directives.callAppComponentSetConfig(this, obj);
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
        hooks$1.callConfigCreate(this);
    }
    getHTMLElement() {
        return this._parentElement;
    }
    beginSafeRender() {
        ObservableSlim.beginRender(this.props);
    }
    endSafeRender() {
        ObservableSlim.endRender(this.props);
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
        const templateArgs = [this.h];
        /*for (let i = 0; i < propsKeys.length; i++) {
            templateArgs.push(this.props[propsKeys[i]]);
        }*/
        const template = this.template.apply(this, templateArgs);
        this.endSafeRender();
        let next = template && typeof template === 'object'
            ? template
            : compile(template);
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
        ObservableSlim.pause(this.props);
        this.renderPause();
    }
    commit() {
        //delay(() => this.renderResume());
        this.renderResume();
        ObservableSlim.resume(this.props);
        //proxy.disableDOMDelayEnd(this.props);
    }
    get isRenderPause() {
        return this._renderPause;
    }
    mount(template, cfg = {}) {
        if (this._unmounted) {
            if (hooks$1.callBeforeMount(this) === false)
                return this;
            this._unmountedPlaceholder.parentNode.replaceChild(this._unmountedParentNode, this._unmountedPlaceholder);
            this._unmounted = false;
            this._unmountedParentNode = null;
            this._unmountedPlaceholder = null;
            hooks$1.callMount(this);
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
        if (hooks$1.callBeforeUnmount(this) === false)
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
            hooks$1.callUnmount(this);
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
        if (!onlyInstance && (!this._rootElement || hooks$1.callBeforeDestroy(this) === false /*|| !this._rootElement.parentNode*/)) {
            return;
        }
        //console.log(this.tag, Object.keys(this.children))
        Object.keys(this.children).forEach(child => {
                this.children[child].destroy();
        });
        hooks$1.callDestroy(this);
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
    _initTemplate(opt) {
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
    }
    _initRawProps(opt) {
        //console.log(this._isSubclass)
        if (!this._isSubclass) {
            this._rawProps = Object.assign({}, typeof opt.cmp.cfg.props === 'function'
                ? opt.cmp.cfg.props()
                : opt.cmp.cfg.props, opt.props);
            this._initTemplate(opt);
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
}

function getComponentName($child) {
    return $child._dozAttach.originalTagName || $child.nodeName.toLowerCase();
}

const trash = [];

function appendChildrenToParent(parent, newElement) {
    //console.log('newElement',newElement.tag,'parent.cmp', parent.cmp.tag, 'che ha', Object.keys(parent.cmp.children).length)
    //return;
    if (parent.cmp) {
        let n =  parent.cmp._childrenInc++; //Object.keys(parent.cmp.children).length++;
        directives.callAppComponentAssignIndex(newElement, n, (index) => {
            //console.log(parent.cmp.tag)
            parent.cmp.children[index] = newElement;
        });
        if (parent.cmp.childrenByTag[newElement.tag] === undefined) {
            parent.cmp.childrenByTag[newElement.tag] = [newElement];
        } else {
            parent.cmp.childrenByTag[newElement.tag].push(newElement);
        }
    }
    //console.log('diventano', Object.keys(parent.cmp.children).length)
}

function flushTrash() {
    trash.forEach($child => $child.remove());
}

function _runMount(newElement = null, cfg, parentCmp) {
    //newElement = _newElement || newElement;

    if (newElement._isRendered)
        return;
    newElement._isRendered = true;
    //console.log('runMount ->', newElement.tag)
    newElement.render(true);
    //console.log('runMount -<', newElement)
    /*if (!componentInstance) {
        componentInstance = newElement;
    }*/
    //console.log(newElement._rootElement)
    newElement._rootElement._dozAttach[COMPONENT_ROOT_INSTANCE] = newElement;
    newElement.getHTMLElement()._dozAttach[COMPONENT_INSTANCE] = newElement;
    // Replace first element child if defaultSlot exists with a slot comment
    if (newElement._defaultSlot && newElement.getHTMLElement().firstElementChild) {
        let slotPlaceholder = document.createComment('slot');
        newElement.getHTMLElement().replaceChild(slotPlaceholder, newElement.getHTMLElement().firstElementChild);
    }

    // This is a hack for call render a second time so the
    // event onAppDraw and onDrawByParent are fired after
    // that the component is mounted.
    // This hack makes also the component that has keys
    // Really this hack is very important :D :D
    // delay(() => {
    //      newElement.render(false, [], true);
    // });

    if (newElement._hasSlots && parentCmp) {
        delay(() =>
            parentCmp.render(false, [], true)
        );
    }

    hooks$1.callMount(newElement);
    //hooks.callMountAsync(newElement);

    if (newElement.waitMount) {
        //cfg.app._onAppComponentsMounted.set(newElement, true);
        //walk(newElement.getHTMLElement().firstElementChild, {cmp: newElement});
        if (!newElement.appReadyExcluded)
            cfg.app._onAppComponentsMounted.delete(newElement);
    }
}

function walk($child, parent = {}, cfg) {
    //console.log('WALK COUNT', walkCount++, $child.nodeName)
    makeSureAttach($child);

    //directive.callAppWalkDOM(parent, $child);
    let cmpName = getComponentName($child);
    directives.callAppComponentAssignName(parent, $child, (name) => {
        cmpName = name;
    });
    let localComponents = {};
    if (parent.cmp && parent.cmp._components) {
        localComponents = parent.cmp._components;
    }
    const cmp = cfg.autoCmp ||
        localComponents[cmpName] ||
        cfg.app._components[cmpName] ||
        collection.getComponent(cmpName);
    //let parentElement;
    //console.log(cmp)
    if (cmp) {
        /*if (parent.cmp) {
            const rawChild = $child.outerHTML;
            parent.cmp.rawChildren.push(rawChild);
        }*/
        // For node created by mount method
        if (parent.cmp && parent.cmp.mounted) {
            return;
        }
        if (parent.cmp && parent.cmp.autoCreateChildren === false) {
            trash.push($child);
            return;
        }
        const props = serializeProps($child);
        const componentDirectives = {};
        const parentCmp = parent.cmp || cfg.parent;
        let newElement;
        if (typeof cmp.cfg === 'function') {
            // This implements single function component
            if (!(cmp.cfg.prototype instanceof Component)) {
                const func = cmp.cfg;
                cmp.cfg = class extends Component {
                };
                cmp.cfg.prototype.template = func;
            }
            newElement = new cmp.cfg({
                tag: cmp.tag || cmpName,
                root: $child,
                app: cfg.app,
                props,
                componentDirectives,
                parentCmp
                //parentCmp: parent.cmp || cfg.parent
            });
        } else {
            if (cmp.cfg.then) {
                let loadingComponent = null;
                let errorComponent = null;
                if ($child.parentElement
                    && $child.parentElement._dozAttach
                    && $child.parentElement._dozAttach.props) {
                    if ($child.parentElement._dozAttach.props['d-async-loading'])
                        loadingComponent = $child.parentElement._dozAttach.props['d-async-loading'];
                    if ($child.parentElement._dozAttach.props['d-async-error'])
                        errorComponent = $child.parentElement._dozAttach.props['d-async-error'];
                }
                (($child, loadingComponent, errorComponent) => {
                    let loadingComponentElement = null;
                    if (loadingComponent) {
                        let __props = {};
                        let __componentDirectives = {};
                        if (typeof loadingComponent === 'object' && loadingComponent.component) {
                            __props = loadingComponent.props || __props;
                            __componentDirectives = loadingComponent.directives || __componentDirectives;
                            loadingComponent = loadingComponent.component;
                        }
                        newElement = new loadingComponent({
                            tag: loadingComponent.tag || 'loading-component',
                            root: $child,
                            app: cfg.app,
                            props: __props,
                            componentDirectives: __componentDirectives,
                            parentCmp
                            //parentCmp: parent.cmp || cfg.parent
                        });
                        loadingComponentElement = newElement;
                    }
                    cmp.cfg
                        .then(componentFromPromise => {
                            //gestisco eventuale ES6 import
                            if (typeof componentFromPromise === 'object') {
                                let oKeys = Object.keys(componentFromPromise);
                                componentFromPromise = componentFromPromise[oKeys[oKeys.length - 1]];
                            }
                            if (componentFromPromise.tag) {
                                let newRootElement = document.createElement(componentFromPromise.tag);
                                $child.replaceWith(newRootElement);
                                $child = newRootElement;
                            }
                            newElement = new componentFromPromise({
                                tag: cmp.tag || cmpName,
                                root: $child,
                                app: cfg.app,
                                props,
                                componentDirectives,
                                parentCmp
                                //parentCmp: parent.cmp || cfg.parent
                            });
                            propsInit(newElement);
                            newElement.app.emit('componentPropsInit', newElement);
                            if (loadingComponentElement)
                                loadingComponentElement.destroy();
                            _runMount(newElement, cfg, parentCmp);
                            //walk(newElement.getHTMLElement(), {cmp: newElement});
                            appendChildrenToParent(parent, newElement);
                        })
                        .catch(e => {
                            if (errorComponent) {
                                let __props = {};
                                let __componentDirectives = {};
                                if (typeof errorComponent === 'object' && errorComponent.component) {
                                    __props = errorComponent.props || __props;
                                    __componentDirectives = errorComponent.directives || __componentDirectives;
                                    errorComponent = errorComponent.component;
                                }
                                newElement = new errorComponent({
                                    tag: errorComponent.tag || 'error-component',
                                    root: $child,
                                    app: cfg.app,
                                    props: __props,
                                    componentDirectives: __componentDirectives,
                                    parentCmp
                                    //parentCmp: parent.cmp || cfg.parent
                                });
                            }
                            console.error(e);
                        });
                })($child, loadingComponent, errorComponent);
            } else {
                //if (!cfg.simulateNull)
                newElement = new Component({
                    tag: cmp.tag || cmpName,
                    cmp,
                    root: $child,
                    app: cfg.app,
                    props,
                    componentDirectives,
                    parentCmp
                    //parentCmp: parent.cmp || cfg.parent
                });
            }
        }
        if (newElement && newElement.__beforeCreateReturnsFalse) {
            newElement = undefined;
        }
        if (!newElement) {
            return;
        }

        newElement.rawChildrenObject = $child._dozAttach.elementChildren;
        newElement.$domEl = $child;

        if (typeof newElement.module === 'object') {
            hmr(newElement, newElement.module);
        }

        propsInit(newElement);
        newElement.app.emit('componentPropsInit', newElement);

        if (newElement.waitMount) {
            //console.log(cfg.app._onAppComponentsMounted)
            if (!newElement.appReadyExcluded)
                cfg.app._onAppComponentsMounted.set(newElement, false);
            newElement.runMount = _runMount.bind(this, newElement, cfg, parentCmp);
            hooks$1.callWaitMount(newElement);
        } else if (hooks$1.callBeforeMount(newElement) !== false) {
            _runMount(newElement, cfg, parentCmp);
        } else {
            newElement.runMount = _runMount.bind(this, newElement, cfg, parentCmp);
        }
        //console.log(newElement)
        //parentElement = newElement;
        appendChildrenToParent(parent, newElement);
        cfg.autoCmp = null;
        return newElement;
    }

}

function createInstance(cfg = {}) {
    /*if (!cfg.root)
        return;*/

    if (cfg.root) {
        if (!(cfg.mountMainComponent)) {
            if (cfg.template instanceof HTMLElement) ; else if (typeof cfg.template === 'string') {
                //console.log('create tpl html')
                cfg.template = html.create(cfg.template);
                cfg.root.appendChild(cfg.template);
            }
        }
    }

    if (cfg.mountMainComponent) {
        // Monto il componente principale
        let newElement = new cfg.component({
            //tag: 'bbb-bbb',//cmp.tag || cmpName,
            cmp: cfg.component,
            root: cfg.root,
            app: cfg.app,
            props: cfg.props || {},
            componentDirectives: {},
            parentCmp: null,
        });
        propsInit(newElement);
        newElement.app.emit('componentPropsInit', newElement);
        newElement._isRendered = true;
        newElement._mainComponentByAppCreate = true;
        newElement.render(true);
        if (cfg.innerHTML) {
            let innerHTMLEl = html.create(cfg.innerHTML, 'div');
            innerHTMLEl.childNodes.forEach(child => {
                newElement.getHTMLElement().appendChild(child);
            });
        }
        walk(newElement.getHTMLElement(), {cmp: newElement}, cfg);
        flushTrash();
        hooks$1.callMount(newElement);
        //hooks.callMountAsync(newElement);
        return newElement;
    } else {
        //if (cfg.parent)
        //console.log(cfg.parent.tag)
        //console.log(cfg.template.outerHTML)
        let newElement = walk(cfg.template, {cmp: cfg.parent}, cfg);
        flushTrash();
        //console.log(newElement)
        //console.log('a', componentInstance.uId)
        //console.log('b', cmp)
        return newElement;
    }
}

var propsPropagation = (function (Doz, app) {
    function propCouldBeADirective(propName) {
        return (propName[0] === 'd' && (propName[1] === ':' || propName[1] === '-'));
    }
    function canBePropagate(mainParent, prop) {
        return ((mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(prop) === -1) || propCouldBeADirective(prop));
    }
    function propagate(child, changes) {
        let mainParent = child._propsPropagationMainParent;
        if (changes) {
            //console.log(changes)
            // when update use this
            changes.forEach(change => {
                if (
                //change.type !== 'update' ||
                //((mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(change.currentPath) === -1) || propCouldBeADirective(change.currentPath))
                canBePropagate(mainParent, change.currentPath))
                    return;
                child.props[change.currentPath] = change.newValue;
            });
        }
        else {
            //console.log('initial')
            // when initialize use this
            Object.keys(mainParent.props).forEach(propParent => {
                if (
                //(mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(propParent) === -1) || propCouldBeADirective(propParent)
                canBePropagate(mainParent, propParent))
                    return;
                child.props[propParent] = mainParent.props[propParent];
            });
        }
    }
    function propagateToAll(mainParent, changes) {
        //console.log(mainParent._propsPropagationChildren.length)
        mainParent._propsPropagationChildren.forEach(child => {
            //console.log('propagate', mainParent.tag, child.tag)
            propagate(child, changes);
        });
    }
    function addToPropagation(child) {
        child._propsPropagationMainParent._propsPropagationChildren.push(child);
    }
    function removeFromPropagation(child) {
        let children = child._propsPropagationMainParent._propsPropagationChildren;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i] === child) {
                children.splice(i, 1);
            }
        }
    }
    app.on('componentSetProps', component => {
        if (component.propsPropagation) {
            //console.log('componentSetProps', component.tag)
            propagateToAll(component);
        }
    });
    app.on('componentPropsInit', component => {
        // for MainParent only
        if (component.propsPropagation) {
            //console.log('componentPropsInit', component.tag)
            Object.defineProperties(component, {
                _propsPropagationIsArray: {
                    value: Array.isArray(component.propsPropagation)
                },
                _propsPropagationIsMainParent: {
                    value: true
                },
                _propsPropagationMainParent: {
                    value: component,
                    writable: true
                },
                _propsPropagationChildren: {
                    value: []
                }
            });
        }
        if (component.parent && component.parent.propsPropagation) {
            if (component.excludeFromPropsPropagation || component.props['d:no-propagation'] !== undefined) {
                Object.defineProperty(component, 'excludeFromPropsPropagation', { value: true });
            }
            else {
                component.propsPropagation = component.parent.propsPropagation;
                component._propsPropagationMainParent = component.parent._propsPropagationMainParent;
                addToPropagation(component);
                propagate(component);
            }
        }
    });
    app.on('componentUpdate', (component, changes) => {
        if (component._propsPropagationIsMainParent) {
            propagateToAll(component, changes);
        }
    });
    app.on('componentDestroy', component => {
        // belongs to a context
        if (component._propsPropagationMainParent) {
            removeFromPropagation(component);
        }
    });
});

const globalStoreObjectName = 'DOZ_STORES';
var serverSideLoadProps = (function (Doz, app) {
    app.on('componentPropsInit', component => {
        let dozStores = window[globalStoreObjectName];
        if (dozStores && component.store && dozStores[component.store]) {
            component.props = dozStores[component.store];
        }
    });
});

// Add props-propagation plugin
use(propsPropagation);
use(serverSideLoadProps);
function use(plugin, options = {}) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }
    plugin['options'] = options;
    registerPlugin(plugin);
}
function load(app) {
    //console.log(data.plugins)
    data.plugins.forEach(func => {
        func(app.constructor, app, func.options);
    });
}
var plugin = {
    use,
    load
};

let appCounter = 0;

class Doz {
    constructor(cfg = {}) {
        this.baseTemplate = `<${TAG.APP}></${TAG.APP}>`;
        if (REGEX.IS_ID_SELECTOR.test(cfg.root)) {
            cfg.root = document.getElementById(cfg.root.substring(1));
        }
        if (REGEX.IS_ID_SELECTOR.test(cfg.template)) {
            cfg.template = document.getElementById(cfg.template.substring(1));
            cfg.template = cfg.template.innerHTML;
        }
        if (!(cfg.root instanceof HTMLElement || cfg.root instanceof ShadowRoot)) {
            throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
        }
        if (!cfg.mainComponent && !(cfg.template instanceof HTMLElement || typeof cfg.template === 'string' || typeof cfg.template === 'function')) {
            throw new TypeError('template must be a string or an HTMLElement or a function or an valid ID selector like #example-template');
        }
        if (cfg.root.hasChildNodes) {
            const appNode = cfg.root.firstElementChild; // document.querySelector(TAG.APP);
            // This fix double app rendering in SSR
            makeSureAttach(appNode);
            if (appNode && !appNode._dozAttach[ALREADY_WALKED]) {
                appNode.parentNode.removeChild(appNode);
            }
        }
        this.cfg = Object.assign({}, {
            components: [],
            shared: {},
            useShadowRoot: false,
            propsListener: null,
            propsListenerAsync: null,
            listeners: null,
            actions: {},
            autoDraw: true,
            enableExternalTemplate: false
        }, cfg);
        Object.defineProperties(this, {
            _lastUId: {
                value: 0,
                writable: true
            },
            _components: {
                value: {},
                writable: true
            },
            _usedComponents: {
                value: {},
                writable: true
            },
            _cache: {
                value: new Map()
            },
            _onAppReadyCB: {
                value: [],
                writable: true
            },
            _onAppComponentsMounted: {
                value: new Map(),
                writable: true
            },
            _callAppReady: {
                value: function () {
                    this._onAppReadyCB.forEach(cb => {
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
            isWebComponent: {
                value: this.cfg.isWebComponent
            },
            byAppCreate: {
                value: this.cfg.byAppCreate
            },
            useShadowRoot: {
                value: this.cfg.useShadowRoot,
                writable: true,
                enumerable: true
            },
            _root: {
                value: this.cfg.root
            },
            appId: {
                value: window.DOZ_APP_ID || Math.random().toString(36).substring(2, 15),
                enumerable: true
            },
            appIntId: {
                value: appCounter++,
                enumerable: true
            },
            action: {
                value: bind$1(this.cfg.actions, this),
                enumerable: true
            },
            onAppEmit: {
                value: this.cfg.onAppEmit,
                writable: true,
                enumerable: true
            },
            shared: {
                value: this.cfg.shared,
                writable: true,
                enumerable: true
            },
            setAllAttributes: {
                value: this.cfg.setAllAttributes,
                writable: true,
                enumerable: true
            },
            onVdomUpdateElement: {
                value: this.cfg.onVdomUpdateElement,
                writable: true,
                enumerable: true
            },
            cacheStores: {
                value: {
                    kCache: new Map(),
                    //tplCache: Object.create(null),
                    hCache: new Map()
                },
                enumerable: true
            },
            mount: {
                value: function (template, root, parent = this._tree) {
                    if (typeof root === 'string') {
                        root = document.querySelector(root);
                    }
                    root = root || parent._rootElement;
                    if (!(root instanceof HTMLElement)) {
                        throw new TypeError('root must be an HTMLElement or an valid selector like #example-root');
                    }
                    const contentStr = this.cfg.enableExternalTemplate ? eval('`' + toLiteralString(template) + '`') : template;
                    const autoCmp = {
                        tag: TAG.MOUNT,
                        cfg: {
                            props: {},
                            template(h) {
                                //return h`<${TAG.ROOT}>${contentStr}</${TAG.ROOT}>`;
                                return contentStr;
                            }
                        }
                    };
                    return createInstance({
                        root,
                        template: `<${TAG.MOUNT}></${TAG.MOUNT}>`,
                        app: this,
                        parentCmp: parent,
                        autoCmp,
                        mount: true
                    });
                },
                enumerable: true
            }
        });
        if (Array.isArray(this.cfg.components)) {
            this.cfg.components.forEach(cmp => {
                if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                    this._components[cmp.tag] = cmp;
                }
            });
        }
        else if (typeof this.cfg.components === 'object') {
            Object.keys(this.cfg.components).forEach(objName => {
                this._components[objName] = {
                    tag: objName,
                    cfg: this.cfg.components[objName]
                };
            });
        }
        plugin.load(this);
        directives.callAppInit(this);
        if (this.cfg.mainComponent) {
            this._tree = createInstance({
                mountMainComponent: true,
                root: this.cfg.root,
                component: this.cfg.mainComponent,
                app: this,
                innerHTML: this.cfg.innerHTML
            }); // || [];
            //console.log(this._tree)
        }
        else {
            this._components[TAG.APP] = {
                tag: TAG.APP,
                cfg: {
                    template: typeof cfg.template === 'function' ? cfg.template : function () {
                        const contentStr = toLiteralString(cfg.template);
                        if (/\${.*?}/g.test(contentStr))
                            return eval('`' + contentStr + '`');
                        else
                            return contentStr;
                    }
                }
            };
            Object.keys(cfg).forEach(p => {
                if (!['template', 'root'].includes(p))
                    this._components[TAG.APP].cfg[p] = cfg[p];
            });
        }
        //Apply listeners
        if (this.cfg.listeners) {
            Object.keys(this.cfg.listeners).forEach(event => {
                //console.log(event)
                this.on(event, this.cfg.listeners[event]);
            });
        }
        if (!this.cfg.mainComponent && this.cfg.autoDraw)
            this.draw();
        this.canAppReady();
    }
    canAppReady() {
        if (this._onAppComponentsMounted.size) {
            setTimeout(() => {
                this.canAppReady();
            });
        }
        else {
            this._callAppReady();
            this.emit('ready', this);
        }
    }
    draw() {
        if (!this.cfg.autoDraw)
            this.cfg.root.innerHTML = '';
        this._tree = createInstance({
            root: this.cfg.root,
            template: this.baseTemplate,
            app: this
        }); // || [];
        return this;
    }
    get mainComponent() {
        return this._tree;
    }
    on(event, callback) {
        if (typeof event !== 'string')
            throw new TypeError('Event must be a string');
        if (typeof callback !== 'function')
            throw new TypeError('Callback must be a function');
        if (!this._onAppCB[event]) {
            this._onAppCB[event] = [];
        }
        this._onAppCB[event].push(callback);
        return this;
    }
    emit(event, ...args) {
        if (this._onAppCB[event]) {
            this._onAppCB[event].forEach(func => {
                func.apply(this, args);
            });
        }
        if (this.onAppEmit) {
            this.onAppEmit(event, ...args);
        }
        return this;
    }
    generateUId() {
        return this.appId + '-' + (++this._lastUId);
    }
}

function component(tag, cfg = {}) {
    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }
    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }
    const cmp = {
        tag,
        cfg
    };
    registerComponent(cmp);
}

function globalMixin(obj) {
    mixin(Component.prototype, obj);
}

function appCreate(root, component, options) {
    let cfg = Object.assign({
        root,
        mainComponent: component,
        byAppCreate: true
    }, options);
    return new Doz(cfg);
}

var tag = (function tag(name) {
    return function (target) {
        target.tag = name;
    };
});

function createStyleSoftEntrance() {
    if (!document.getElementById('style--soft-entrance--')) {
        const style = document.createElement('style');
        style.id = 'style--soft-entrance--';
        style.innerHTML = `[data-soft-entrance] {visibility: hidden!important;}`;
        document.head.appendChild(style);
    }
}

createStyleSoftEntrance();
function createDozWebComponent(tag, cmp, observedAttributes = [], prefix = 'dwc', globalTag, exposedMethods = [], exposedListeners = []) {
    data.webComponents.tags[tag] = data.webComponents.tags[tag] || {};
    if (prefix) {
        prefix += '-';
    }
    customElements.define(prefix + tag, class extends HTMLElement {
        static get observedAttributes() {
            return observedAttributes;
        }
        constructor() {
            super();
        }
        connectedCallback() {
            let initialProps = {};
            let id = null;
            let contentHTML = '';
            let hasDataNoShadow = this.hasAttribute('data-no-shadow');
            let root = !hasDataNoShadow ? this.attachShadow({ mode: 'open' }) : this;
            let thisElement = this;
            for (let att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                att = atts[i];
                if (att.nodeName === 'data-id') {
                    id = att.nodeValue;
                    continue;
                }
                if (observedAttributes.includes(att.nodeName)) {
                    initialProps[dashToCamel(att.nodeName)] = att.nodeValue;
                }
            }
            let onAppReady = function () {
                let firstChild = this.app.byAppCreate ? this : this.children[0];
                exposedMethods.forEach(method => {
                    if (firstChild[method]) {
                        thisElement[method] = firstChild[method].bind(firstChild);
                    }
                });
                thisElement.removeAttribute('data-soft-entrance');
                firstChild.props = Object.assign({}, firstChild.props, initialProps);
                let countCmp = Object.keys(data.webComponents.tags[tag]).length++;
                data.webComponents.tags[tag][id || countCmp] = firstChild;
                if (id !== null) {
                    if (data.webComponents.ids[id])
                        return console.warn(id + ': id already exists for DozWebComponent');
                    data.webComponents.ids[id] = firstChild;
                }
            };
            let onAppEmit = function (event, ...args) {
                if (exposedListeners.indexOf(event) > -1) {
                    let eventInstance = new CustomEvent(event, {
                        detail: args
                    });
                    thisElement.dispatchEvent(eventInstance);
                }
            };
            contentHTML = this.innerHTML.trim();
            this.innerHTML = '';
            let tagCmp = cmp || globalTag || tag;
            //console.log(contentHTML)
            if (cmp && typeof cmp !== "object") {
                cmp.__postListeners = {
                    onAppReady
                };
                this.dozApp = appCreate(root, cmp, {
                    isWebComponent: true,
                    useShadowRoot: !hasDataNoShadow,
                    innerHTML: contentHTML,
                    onAppEmit
                });
            }
            else {
                this.dozApp = new Doz({
                    root,
                    isWebComponent: true,
                    useShadowRoot: !hasDataNoShadow,
                    //language=HTML
                    template(h) {
                        return h `
                            <${tagCmp}>${contentHTML}</${tagCmp}>
                        `;
                    },
                    onAppReady,
                    onAppEmit
                });
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.dozApp)
                return;
            let firstChild = this.dozApp.byAppCreate ? this.dozApp.mainComponent : this.dozApp.mainComponent.children[0];
            firstChild.props[dashToCamel(name)] = newValue;
        }
    });
}
function defineWebComponent(tag, cmp, observedAttributes = [], exposedMethods = [], exposedListeners = []) {
    createDozWebComponent(tag, cmp, observedAttributes, '', null, exposedMethods, exposedListeners);
}
function defineWebComponentFromGlobal(tag, globalTag, observedAttributes = [], exposedMethods = [], exposedListeners = []) {
    createDozWebComponent(tag, null, observedAttributes, '', globalTag, exposedMethods, exposedListeners);
}

const { directive: directive$b } = directives;
var store = (function () {

    directive$b(':store', {
        createStore(instance, storeName) {
            if (typeof storeName === 'string') {
                if (instance.app._stores[storeName] !== undefined) {
                    throw new Error(`Store already defined: ${storeName}`);
                }
                instance.app._stores[storeName] = instance.props;
                instance.store = storeName;
            }
        },
        syncStore(instance, storeName) {
            if (typeof storeName === 'string' && instance.app._stores[storeName] !== undefined) {
                instance.app._stores[storeName] = instance.props;
            }
        },
        onAppInit(app) {
            app._stores = {};
            app.getStore = function (store) {
                return app._stores[store];
            };
            /*
            Object.defineProperties(app, {
                _stores: {
                    value: {},
                    writable: true
                },
                getStore: {
                    value: function (store) {
                        return app._stores[store];
                    },
                    enumerable: true
                }
            });

             */
        },
        // Create by property defined
        onAppComponentCreate(instance) {
            /*instance.getStore = function (store) {
                return instance.app._stores[store];
            }*/
            instance.getStore = instance.app.getStore;
            /*
            Object.defineProperties(instance, {
                getStore: {
                    value: function (store) {
                        return instance.app._stores[store];
                    },
                    enumerable: true
                }
            });

             */
            if (instance.store !== undefined && instance.props['d:store'] === undefined) {
                this.createStore(instance, instance.store);
            }
        },
        // Create by props
        onComponentCreate(instance, directiveValue) {
            this.createStore(instance, directiveValue);
        },
        onAppComponentLoadProps(instance) {
            this.syncStore(instance, instance.store);
        },
        onAppComponentSetProps(instance) {
            this.syncStore(instance, instance.store);
        },
        onAppComponentSetConfig(instance, obj) {
            if (typeof obj.store === 'string') {
                this.createStore(instance, obj.store);
            }
        },
        onAppComponentDestroy(instance) {
            if (instance.store && instance.app._stores[instance.store])
                delete instance.app._stores[instance.store];
        },
    });
});

const { directive: directive$a } = directives;
var id = (function () {
    directive$a(':id', {
        createId(instance, id) {
            if (typeof id === 'string') {
                /*if (instance.app._ids[id] !== undefined) {
                    throw new Error(`ID already defined: ${id}`);
                }*/
                instance.app._ids[id] = instance;
                instance.id = id;
            }
        },
        onAppInit(app) {
            app._ids = {};
            app.getComponentById = function (id) {
                return app._ids[id];
            };
            /*Object.defineProperties(app, {
                _ids: {
                    value: {},
                    writable: true
                },
                getComponentById: {
                    value: function (id) {
                        return app._ids[id];
                    },
                    enumerable: true
                }
            });*/

        },
        onAppComponentCreate(instance) {
            instance.getComponentById = function (id) {
                return instance.app._ids[id];
            };

            instance.getCmp = instance.getComponentById;

            /*
            Object.defineProperties(instance, {
                getComponentById: {
                    value: function (id) {
                        return instance.app._ids[id];
                    },
                    enumerable: true
                },
                getCmp: {
                    value: function (id) {
                        return instance.app._ids[id];
                    },
                    enumerable: true
                }
            });

             */
            if (instance.id !== undefined && instance.props['d:id'] === undefined) {
                this.createId(instance, instance.id);
            }
        },
        onComponentCreate(instance, directiveValue) {
            this.createId(instance, directiveValue);
        },
        onAppComponentSetConfig(instance, obj) {
            if (typeof obj.id === 'string') {
                this.createId(instance, obj.id);
            }
        },
        onAppComponentDestroy(instance) {
            if (instance.id && instance.app._ids[instance.id])
                delete instance.app._ids[instance.id];
        },
    });
});

const { directive: directive$9 } = directives;
var alias = (function () {
    directive$9(':alias', {
        createAlias(instance, alias) {
            if (typeof alias === 'string') {
                instance.alias = alias;
            }
        },
        onAppInit(app) {
            app.getComponent = function (alias) {
                //console.log(this._tree.children)
                return this._tree
                    ? this._tree.children[alias]
                    : undefined;
            };
            /*Object.defineProperties(app, {
                getComponent: {
                    value: function (alias) {
                        //console.log(this._tree.children)
                        return this._tree
                            ? this._tree.children[alias]
                            : undefined;
                    },
                    enumerable: true
                }
            });*/
        },
        onAppComponentCreate(instance) {
            instance.getComponent = function (alias) {
                return this.children
                    ? this.children[alias]
                    : undefined;
            };
            /*
            Object.defineProperties(instance, {
                getComponent: {
                    value: function (alias) {
                        return this.children
                            ? this.children[alias]
                            : undefined;
                    },
                    enumerable: true
                }
            });

             */
        },
        onComponentCreate(instance, directiveValue) {
            this.createAlias(instance, directiveValue);
        },
        onAppComponentSetConfig(instance, obj) {
            if (typeof obj.alias === 'string') {
                this.createAlias(instance, obj.alias);
            }
        },
        onAppComponentAssignIndex(instance, n) {
            return instance.alias ? instance.alias : n;
        }
    });
});

const { directive: directive$8 } = directives;
var on = (function () {
    directive$8(':on-$event', {
        onAppComponentCreate(instance) {
            instance._callback = {};
            instance.emit = function (name, ...args) {
                if (!instance._callback)
                    return;
                if (typeof instance._callback[name] === 'function') {
                    instance._callback[name].apply(instance.parent, args);
                    // legacy for string
                }
                else if (instance._callback[name] !== undefined
                    && instance.parent[instance._callback[name]] !== undefined
                    && typeof instance.parent[instance._callback[name]] === 'function') {
                    instance.parent[instance._callback[name]].apply(instance.parent, args);
                }
            };
            /*
            Object.defineProperties(instance, {
                _callback: {
                    value: {},
                    writable: true
                },
                emit: {
                    value: function (name, ...args) {
                        if (!instance._callback)
                            return;
                        if (typeof instance._callback[name] === 'function') {
                            instance._callback[name].apply(instance.parent, args);
                            // legacy for string
                        }
                        else if (instance._callback[name] !== undefined
                            && instance.parent[instance._callback[name]] !== undefined
                            && typeof instance.parent[instance._callback[name]] === 'function') {
                            instance.parent[instance._callback[name]].apply(instance.parent, args);
                        }
                    },
                    enumerable: true
                }
            });

             */
        },
        onComponentCreate(instance, directiveValue, keyArguments) {
            let source = {};
            source[keyArguments.event] = directiveValue;
            Object.assign(instance._callback, source);
        },
    });
});

const { directive: directive$7 } = directives;
directive$7(':onbeforemount', {
    onComponentBeforeMount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
directive$7(':onmount', {
    onComponentMount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
/*directive(':onmountasync', {
    onComponentMountAsync(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});*/
directive$7(':onafterrender', {
    onComponentAfterRender(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance, changes);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});
directive$7(':onbeforeupdate', {
    onComponentBeforeUpdate(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance, changes);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});
directive$7(':onupdate', {
    onComponentUpdate(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance, changes);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});
directive$7(':onbeforeunmount', {
    onComponentBeforeUnmount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
directive$7(':onunmount', {
    onComponentUnmount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
directive$7(':onbeforedestroy', {
    onComponentBeforeDestroy(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
directive$7(':ondestroy', {
    onComponentDestroy(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
directive$7(':onloadprops', {
    onComponentLoadProps(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        }
        else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});
var hooks = (function () {
    directive$7(':onbeforecreate', {
        onComponentBeforeCreate(instance, directiveValue) {
            if (typeof directiveValue === 'function') {
                return directiveValue(instance);
            }
            else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
                return instance.parent[directiveValue].call(instance.parent, instance);
            }
        }
    });
    directive$7(':oncreate', {
        onComponentCreate(instance, directiveValue) {
            if (typeof directiveValue === 'function') {
                directiveValue(instance);
            }
            else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
                instance.parent[directiveValue].call(instance.parent, instance);
            }
        }
    });
});

const { directive: directive$6 } = directives;
var ref = (function () {
    directive$6('ref', {
        onAppComponentCreate(instance) {
            instance.ref = {};
            /*
            Object.defineProperties(instance, {
                ref: {
                    value: {},
                    writable: true,
                    enumerable: true
                }
            });

             */
        },
        onComponentDOMElementCreate(instance, $target, directiveValue) {
            instance.ref[directiveValue] = $target;
        }
    });
});

const { directive: directive$5 } = directives;
var is = (function () {
    directive$5('is', {
        hasDataIs($target) {
            //console.log($target._dozAttach.props && $target._dozAttach.props['d-is'])
            return $target._dozAttach.props && $target._dozAttach.props['d-is'];
            //return $target.dataset && /**/$target.dataset.is;
        },
        onAppComponentAssignName(instance, $target) {
            //console.log('onAppComponentAssignName',$target)
            if (this.hasDataIs($target)) {
                return $target._dozAttach.props['d-is'];/**/
                //return $target.dataset.is;/**/
            }
        },
        onAppComponentPropsAssignName($target, propsName, isDirective) {
            //console.log('onAppComponentPropsAssignName',$target)
            if (this.hasDataIs($target))
                return dashToCamel(propsName);/**/
            /*else
                return propsName;*/
        },
        onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
            $target.dataset.is = directiveValue;
            //if (!initial) {
                //instance._processing.push({node: $target, action: 'create'});
                doCreateInstance(instance, $target);
            //}
        },
    });
});

const { directive: directive$4 } = directives;
var bind = (function () {
    directive$4('bind', {
        // Start directive methods
        onAppComponentCreate(instance) {
            instance._boundElements = {};
            /*Object.defineProperties(instance, {
                _boundElements: {
                    value: {},
                    writable: true
                }
            });*/
        },
        onAppComponentUpdate(instance, changes) {
            if (!Object.keys(instance._boundElements).length)
                return;
            //delay(() => {
            this.updateBoundElementsByChanges(instance, changes);
            //});
        },
        onAppComponentLoadProps(instance) {
            //delay(() => {
            this.updateBoundElementsByPropsIteration(instance);
            //});
        },
        onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
            if (!this.canBind($target))
                return;
            this.setBind(instance, $target, directiveValue);
        },
        // End directive methods
        // Start custom methods
        canBind($target) {
            return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1;
        },
        setBind(instance, $target, value) {
            if (instance.props[value] === undefined)
                return;
            // Add UI events
            let events = ['compositionstart', 'compositionend', 'input', 'change'];
            events.forEach(function (event) {
                $target.addEventListener(event, function (e) {
                    let _value;
                    if (this.type === 'checkbox') {
                        if (!this.defaultValue)
                            instance.props[value] = this.checked;
                        else {
                            const inputs = instance.appRoot.querySelectorAll(`input[name=${this.name}][type=checkbox]:checked`);
                            _value = [...inputs].map(input => input.value);
                            //instance.props[value] = castStringTo(_value);
                            instance.props[value] = _value;
                        }
                    }
                    else {
                        _value = this.value;
                        if (this.multiple) {
                            _value = [...this.options].filter(option => option.selected).map(option => option.value);
                        }
                        //instance.props[value] = castStringTo(_value);
                        instance.props[value] = _value;
                    }
                });
            });
            // Map $target element with prop name
            if (instance._boundElements[value] !== undefined) {
                instance._boundElements[value].push($target);
            }
            else {
                instance._boundElements[value] = [$target];
            }
            // Set first value
            // Why this delay? because I need to waiting options tag
            delay(() => {
                this.updateBoundElement($target, instance.props[value], instance);
            });
        },
        updateBoundElementsByChanges(instance, changes) {
            changes.forEach(item => {
                let value = item.newValue;
                let property = item.property;
                this.updateBoundElements(instance, value, property);
            });
        },
        updateBoundElementsByPropsIteration(instance) {
            let _this = this;
            (function iterate(props) {
                let keys = Object.keys(props);
                for (let i = 0, l = keys.length; i < l; i++) {
                    let property = keys[i];
                    if (props[property] instanceof Object && props[property] !== null) {
                        iterate(props[property]);
                    }
                    else {
                        _this.updateBoundElements(instance, props[property], property);
                    }
                }
            })(instance._rawProps);
        },
        updateBoundElements(instance, value, property) {
            if (Object.prototype.hasOwnProperty.call(instance._boundElements, property)) {
                instance._boundElements[property].forEach($target => {
                    this.updateBoundElement($target, value, instance);
                });
            }
        },
        updateBoundElement($target, value, instance) {
            if ($target.type === 'checkbox') {
                if (!$target.defaultValue)
                    $target.checked = value;
                else if (Array.isArray(value)) {
                    const inputs = instance.appRoot.querySelectorAll(`input[name=${$target.name}][type=checkbox]`);
                    [...inputs].forEach(input => input.checked = value.includes(input.value));
                }
            }
            else if ($target.type === 'radio') {
                $target.checked = $target.value === value;
            }
            else if ($target.type === 'select-multiple' && Array.isArray(value)) {
                [...$target.options].forEach(option => option.selected = value.includes(option.value));
            }
            else {
                $target.value = value;
            }
        }
    });
});

function queue(p, arrayOfP) {
    if (!p)
        return;
    new Promise(p).then(() => queue(arrayOfP.shift(), arrayOfP));
}

const { directive: directive$3 } = directives;
var show = (function () {
    directive$3('show', {
        onAppComponentCreate(instance) {
            /*Object.defineProperties(instance, {
                show: {
                    value: show,
                    writable: true,
                    enumerable: true
                },
                hide: {
                    value: hide,
                    writable: true,
                    enumerable: true
                }
            });*/
        },
        setVisible($target, value) {
            const thereIsAnimateDirective = $target._dozAttach.__animationDirectiveValue;
            $target._dozAttach.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';
            let lockAnimation = false;
            if ($target._dozAttach.__showInitialValue === undefined) {
                $target._dozAttach.__showInitialValue = value;
                lockAnimation = !value;
            }
            //$target.__animationWasUsed =
            //console.dir($target);
            if ($target._dozAttach.__prevValueOfShow === value)
                return;
            $target._dozAttach.__prevValueOfShow = value;
            //if (thereIsAnimateDirective && !lockAnimation/*&& $target._dozAttach.__prevValueOfShow !== value*/ && $target._dozAttach.__animationWasUsedByShowDirective) {
            if (thereIsAnimateDirective && !lockAnimation) {
                //console.log($target._dozAttach.__animationIsRunning)
                if (!$target._dozAttach.__animationsList)
                    $target._dozAttach.__animationsList = [];
                $target._dozAttach.__animationUsedByShowDirective = true;
                $target._dozAttach.__animationsList.push((resolve) => {
                    //console.log('value', value)
                    if (value) {
                        $target.style.display = $target._dozAttach.__showOriginDisplay;
                        $target._dozAttach.__animationShow(() => {
                            $target.style.display = $target._dozAttach.__showOriginDisplay;
                            //$target._dozAttach.__prevValueOfShow = value;
                            $target._dozAttach.__animationUsedByShowDirective = false;
                            resolve();
                        });
                    }
                    else {
                        $target._dozAttach.__animationHide(() => {
                            $target.style.display = 'none';
                            //$target._dozAttach.__prevValueOfShow = value;
                            $target._dozAttach.__animationUsedByShowDirective = false;
                            resolve();
                        });
                    }
                });
                //console.log($target._dozAttach.__animationsList)
                if (thereIsAnimateDirective.queue) {
                    if (!$target._dozAttach.__animationIsRunning) {
                        // please don't use it
                        queue($target._dozAttach.__animationsList.shift(), $target._dozAttach.__animationsList);
                    }
                }
                else {
                    new Promise($target._dozAttach.__animationsList.shift()).then();
                }
            }
            else {
                //$target._dozAttach.__prevValueOfShow = value;
                //if (thereIsAnimateDirective)
                //$target._dozAttach.__animationWasUsedByShowDirective = true;/**/
                //delay(() => {
                $target.style.display = !value /*=== false*/ ? 'none' : $target._dozAttach.__showOriginDisplay;
                //});
            }
        },
        onComponentDOMElementCreate(instance, $target, directiveValue) {
            this.setVisible($target, directiveValue);
        },
        onComponentDOMElementUpdate(instance, $target, directiveValue) {
            this.setVisible($target, directiveValue);
        },
    });
});

window.requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
function wait(what, callback, maxCount = 1000, exceededCallback) {
    let rid;
    let count = 0;
    let cancelWait = function () {
        window.cancelAnimationFrame(rid);
        rid = null;
    };
    let check = function () {
        if (count >= maxCount) {
            console.warn('wait, max cycles exceeded ' + maxCount);
            if (typeof exceededCallback === 'function')
                exceededCallback();
            return;
        }
        if (!what(cancelWait)) {
            count++;
            rid = window.requestAnimationFrame(check);
        }
        else {
            if (rid) {
                cancelWait();
                /*window.cancelAnimationFrame(rid);
                rid = null;*/
            }
            callback();
        }
    };
    rid = window.requestAnimationFrame(check);
}

function animateHelper($target, animationName, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }
    else if (!opts) {
        opts = {};
    }
    if (opts.mode === 'hide' && $target.style.display === 'none') {
        //console.log('already hidden');
        return;
    }
    if ($target._dozAttach.__animationIsRunning) {
        $target.classList.remove($target._dozAttach.__lastAnimationName);
        $target._dozAttach.__animationIsRunning = false;
        $target._dozAttach.__lockedForAnimation = false;
        $target.removeEventListener('animationend', $target._dozAttach.__handleAnimationEnd);
    }
    $target._dozAttach.__animationIsRunning = true;
    let computedStyle = window.getComputedStyle($target);
    opts.classLib = opts.classLib || 'animated'; //Default animate.css
    // Now supports IE11
    $target.classList.add(opts.classLib);
    $target.classList.add(animationName);
    $target._dozAttach.__lastAnimationName = animationName;
    $target._dozAttach.__animationOriginDisplay = computedStyle.display;
    if ($target._dozAttach.__animationOriginDisplay === 'inline') {
        $target.style.display = 'inline-block';
    }
    if (opts.delay) {
        $target.style.animationDelay = opts.delay;
        $target.style.webkitAnimationDelay = opts.delay;
        $target.style.mozAnimationDelay = opts.delay;
    }
    if (opts.duration) {
        $target.style.animationDuration = opts.duration;
        $target.style.webkitAnimationDuration = opts.duration;
        $target.style.mozAnimationDuration = opts.duration;
    }
    if (opts.iterationCount) {
        $target.style.animationIterationCount = opts.iterationCount;
        $target.style.webkitAnimationIterationCount = opts.iterationCount;
        $target.style.mozAnimationIterationCount = opts.iterationCount;
    }
    function handleAnimationEnd() {
        //console.log('call animation end')
        $target.classList.remove(opts.classLib);
        $target.classList.remove(animationName);
        $target._dozAttach.__animationIsRunning = false;
        $target._dozAttach.__lockedForAnimation = false;
        //$target.style.display = $target._dozAttach.__animationOriginDisplay;
        $target.style.animationDelay = '';
        $target.style.webkitAnimationDelay = '';
        $target.style.mozAnimationDelay = '';
        $target.style.animationDuration = '';
        $target.style.webkitAnimationDuration = '';
        $target.style.mozAnimationDuration = '';
        $target.style.animationIterationCount = '';
        $target.style.webkitAnimationIterationCount = '';
        $target.style.mozAnimationIterationCount = '';
        $target.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function')
            callback();
        if (typeof opts.cb === 'function')
            opts.cb();
    }
    //console.log('set animation end to', $target);
    //console.log('body contains', document.body.contains($target));
    $target.addEventListener('animationend', handleAnimationEnd);
    $target._dozAttach.__handleAnimationEnd = handleAnimationEnd;
    $target._dozAttach.__animationReset = () => handleAnimationEnd();
}

const { directive: directive$2 } = directives;
var animate = (function () {
    directive$2('animate', {
        onAppComponentCreate(instance) {
            instance.animate = animateHelper;
            instance.elementsWithAnimation = new Map();
            /*Object.defineProperties(instance, {
                animate: {
                    value: animateHelper,
                    enumerable: true
                },
                elementsWithAnimation: {
                    value: new Map(),
                    writable: true
                }
            });*/
        },
        createLockRemoveInstanceByCallback(instance) {
            instance.lockRemoveInstanceByCallback = (callerMethod, ...args) => {
                if (instance.lockRemoveInstanceByCallbackIsCalled)
                    return;
                instance.lockRemoveInstanceByCallbackIsCalled = true;
                let animationsEnd = [];
                for (let [key, value] of instance.elementsWithAnimation) {
                    let $targetOfMap = key;
                    let directiveValueOfMap = value;
                    animationsEnd.push(new Promise(resolve => {
                        if (!document.body.contains($targetOfMap))
                            return resolve();
                        wait((cancelWait) => {
                            if ($targetOfMap._dozAttach.__animationUsedByShowDirective) {
                                cancelWait();
                                return true;
                            }
                            return !$targetOfMap._dozAttach.__animationIsRunning;
                        }, () => {
                            let optAnimation = {
                                duration: directiveValueOfMap.hide.duration,
                                delay: directiveValueOfMap.hide.delay,
                                iterationCount: directiveValueOfMap.hide.iterationCount,
                                cb: directiveValueOfMap.hide.cb,
                                classLib: directiveValueOfMap.classLib,
                            };
                            instance.animate($targetOfMap, directiveValueOfMap.hide.name, optAnimation, () => {
                                $targetOfMap.style.display = 'none';
                                resolve();
                            });
                        }, 1000, () => {
                            $targetOfMap._dozAttach.__animationReset();
                        });
                    }));
                }
                Promise.all(animationsEnd).then(() => {
                    instance.lockRemoveInstanceByCallback = null;
                    instance.lockRemoveInstanceByCallbackIsCalled = false;
                    callerMethod.apply(instance, args);
                }, reason => {
                    throw new Error(reason);
                });
            };
        },
        createAnimations(instance, $target, directiveValue) {
            if ($target._dozAttach.__lockedForAnimation)
                return;
            $target._dozAttach.__lockedForAnimation = true;
            if (typeof directiveValue === 'string') {
                directiveValue = {
                    show: directiveValue,
                    hide: directiveValue
                };
            }
            $target._dozAttach.__animationDirectiveValue = directiveValue;
            if (directiveValue.show) {
                /**/
                if (typeof directiveValue.show !== 'object') {
                    directiveValue.show = {
                        name: directiveValue.show
                    };
                }
                let optAnimation = {
                    duration: directiveValue.show.duration,
                    delay: directiveValue.show.delay,
                    iterationCount: directiveValue.show.iterationCount,
                    cb: directiveValue.show.cb,
                    classLib: directiveValue.classLib,
                    mode: 'show'
                };
                //Add always an useful method for show
                $target._dozAttach.__animationShow = (cb) => instance.animate($target, directiveValue.show.name, optAnimation, cb);
                /**/
                //(function ($target, directiveValue, instance) {
                wait((cancelWait) => {
                    //console.log($target._dozAttach.__animationIsRunning)
                    if ($target._dozAttach.__animationUsedByShowDirective) {
                        cancelWait();
                        return true;
                    }
                    return !$target._dozAttach.__animationIsRunning;
                }, () => {
                    if (!document.body.contains($target))
                        return;
                    if ($target._dozAttach.__animationOriginDisplay) {
                        $target.style.display = $target._dozAttach.__animationOriginDisplay;
                    }
                    //Exclude if element is not displayed
                    if ($target.style.display === 'none')
                        return;
                    instance.animate($target, directiveValue.show.name, optAnimation);
                }, 1000, () => {
                    $target._dozAttach.__animationReset();
                });
                //})($target, directiveValue, instance);
            }
            if (directiveValue.hide) {
                if (typeof directiveValue.hide !== 'object') {
                    directiveValue.hide = {
                        name: directiveValue.hide
                    };
                }
                let optAnimation = {
                    duration: directiveValue.hide.duration,
                    delay: directiveValue.hide.delay,
                    iterationCount: directiveValue.hide.iterationCount,
                    cb: directiveValue.hide.cb,
                    classLib: directiveValue.classLib,
                    mode: 'hide'
                };
                //Add always an useful method for show
                $target._dozAttach.__animationHide = (cb) => instance.animate($target, directiveValue.hide.name, optAnimation, cb);
                this.createLockRemoveInstanceByCallback(instance);
            }
            instance.elementsWithAnimation.set($target, directiveValue);
            setTimeout(() => {
                Object.keys(instance.children).forEach(i => {
                    const childInstance = instance.children[i];
                    const $childTarget = childInstance.getHTMLElement();
                    const elementAnimation = instance.elementsWithAnimation.get($childTarget);
                    if (elementAnimation) {
                        if (!childInstance.lockRemoveInstanceByCallback) {
                            childInstance.elementsWithAnimation.set($childTarget, elementAnimation);
                            this.createLockRemoveInstanceByCallback(childInstance);
                        }
                    }
                });
            });
        },
        onComponentDOMElementCreate(instance, $target, directiveValue) {
            //console.log('onComponentDOMElementCreate', 'animation', $target);
            this.createAnimations(instance, $target, directiveValue);
        },
        onAppComponentMount(instance) {
            if (!instance.elementsWithAnimation || !instance.elementsWithAnimation.size)
                return;
            for (let [key, value] of instance.elementsWithAnimation) {
                this.createAnimations(instance, key, value);
            }
        }
    });
});

const { directive: directive$1 } = directives;
var lazy = (function () {
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    directive$1('lazy', {
        onAppInit(app) {
            app.lazyComponentsList = new Set();
            /*Object.defineProperties(app, {
                lazyComponentsList: {
                    value: new Set(),
                    enumerable: false
                }
            });*/
            window.addEventListener('scroll', () => {
                app.lazyComponentsList.forEach(component => {
                    this.canRunMount(app, component);
                });
            });
        },
        onComponentCreate(instance) {
            instance.waitMount = true;
            instance.appReadyExcluded = true;
            instance.app.lazyComponentsList.add(instance);
        },
        onComponentWaitMount(instance) {
            this.canRunMount(instance.app, instance);
        },
        canRunMount(app, component) {
            if (isInViewport(component.$domEl)) {
                component.runMount();
                app.lazyComponentsList.delete(component);
            }
        }
    });
});

var bootstrap = (function run() {
    store();
    id();
    alias();
    on();
    hooks();
    ref();
    is();
    bind();
    show();
    animate();
    lazy();
});

const { directive } = directives;
bootstrap();
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
        value: globalMixin,
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
        value: '4.0.3',
        enumerable: true
    },
    tag: {
        value: tag,
        enumerable: true
    },
    createDozWebComponent: {
        value: createDozWebComponent,
        enumerable: true
    },
    defineWebComponent: {
        value: defineWebComponent,
        enumerable: true
    },
    defineWebComponentFromGlobal: {
        value: defineWebComponentFromGlobal,
        enumerable: true
    },
    appCreate: {
        value: appCreate,
        enumerable: true
    },
    createInstance: {
        value: createInstance,
        enumerable: true
    }
});
const version = Doz.version;

export { Component, appCreate, collection, compile, component, createDozWebComponent, createInstance, Doz as default, component as define, defineWebComponent, defineWebComponentFromGlobal, directive, h, globalMixin as mixin, tag, update, use, version };
