const {registerDirective, data} = require('../collection');
const {REGEX} = require('../constants.js');

function extractDirectivesFromProps(cmp) {
    //let canBeDeleteProps = true;
    let props;

    if (!Object.keys(cmp.props).length) {
        props = cmp._rawProps;
        //canBeDeleteProps = false;
    } else {
        props = cmp.props;
    }

    Object.keys(props).forEach(key => {
        if (REGEX.IS_DIRECTIVE.test(key)) {
            let keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            cmp._directiveProps[keyWithoutD] = props[key];
            /*if (canBeDeleteProps)
                delete props[key];*/
        }
    });

    return cmp._directiveProps;
}

function directive(name, options = {}) {
    registerDirective(name, options);
}

function callMethod(...args) {
    let method = args[0];
    let cmp = args[1];

    // Remove first argument event name
    args.shift();
    //console.warn(cmp.tag, method, cmp.props)

    let directivesKeyValue = extractDirectivesFromProps(cmp);

    Object.keys(directivesKeyValue).forEach(key => {

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
            directiveObj[method].apply(directiveObj, outArgs)
        }
    });
}

function callMethodNoDirective(...args) {
    let method = args.shift();
    let oKeys = Object.keys(data.directives);
    let callback;

    // Search for a possible callback
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'function') {
            callback = args[i];
            break;
        }
    }

    for (let i = 0; i < oKeys.length; i++) {
        let key = oKeys[i];
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            let res = data.directives[key][method].apply(data.directives[key], args);
            // If res returns something, fire the callback
            if (res !== undefined && callback)
                callback(res);
        }
    }
}

// Hooks for DOM element
function callDOMAttributeCreate(instance, $target, attributeName, attributeValue, nodeProps) {
    let method = 'onDOMAttributeCreate';
    if (REGEX.IS_DIRECTIVE.test(attributeName)) {
        let directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
        let directiveObj = data.directives[directiveName];
        if (directiveObj && directiveObj[method]) {
            $target.removeAttribute(attributeName);
            directiveObj[method].apply(directiveObj, [instance, $target, attributeName, attributeValue, nodeProps])
        }
    }
}

// Hooks for the component
function callComponentBeforeCreate(...args) {
    args = ['onComponentBeforeCreate', ...args];
    callMethod.apply(null, args)
}

function callComponentCreate(...args) {
    args = ['onComponentCreate', ...args];
    callMethod.apply(null, args)
}

function callComponentBeforeMount(...args) {
    args = ['onComponentBeforeMount', ...args];
    callMethod.apply(null, args)
}

function callComponentMount(...args) {
    args = ['onComponentMount', ...args];
    callMethod.apply(null, args)
}

function callComponentMountAsync(...args) {
    args = ['onComponentMountAsync', ...args];
    callMethod.apply(null, args)
}

function callComponentAfterRender(...args) {
    args = ['onComponentAfterRender', ...args];
    callMethod.apply(null, args)
}

function callComponentBeforeUpdate(...args) {
    args = ['onComponentBeforeUpdate', ...args];
    callMethod.apply(null, args)
}

function callComponentUpdate(...args) {
    args = ['onComponentUpdate', ...args];
    callMethod.apply(null, args)
}

function callComponentBeforeUnmount(...args) {
    args = ['onComponentBeforeUnmount', ...args];
    callMethod.apply(null, args)
}

function callComponentUnmount(...args) {
    args = ['onComponentUnmount', ...args];
    callMethod.apply(null, args)
}

function callComponentBeforeDestroy(...args) {
    args = ['onComponentBeforeDestroy', ...args];
    callMethod.apply(null, args)
}

function callComponentDestroy(...args) {
    args = ['onComponentDestroy', ...args];
    callMethod.apply(null, args)
}

function callComponentLoadProps(...args) {
    args = ['onComponentLoadProps', ...args];
    callMethod.apply(null, args)
}

// All methods that starts with prefix callSystem are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id

function callSystemAppInit(...args) {
    args = ['onSystemAppInit', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentCreate(...args) {
    args = ['onSystemComponentCreate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentBeforeCreate(...args) {
    args = ['onSystemComponentBeforeCreate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentConfigCreate(...args) {
    args = ['onSystemComponentConfigCreate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentBeforeMount(...args) {
    args = ['onSystemComponentBeforeMount', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentMount(...args) {
    args = ['onSystemComponentMount', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentMountAsync(...args) {
    args = ['onSystemComponentMountAsync', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentBeforeUpdate(...args) {
    args = ['onSystemComponentBeforeUpdate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentUpdate(...args) {
    args = ['onSystemComponentUpdate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentDrawByParent(...args) {
    args = ['onSystemComponentDrawByParent', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentAfterRender(...args) {
    args = ['onSystemComponentAfterRender', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentBeforeUnmount(...args) {
    args = ['onSystemComponentBeforeUnmount', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentUnmount(...args) {
    args = ['onSystemComponentUnmount', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentBeforeDestroy(...args) {
    args = ['onSystemComponentBeforeDestroy', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentSetConfig(...args) {
    args = ['onSystemComponentSetConfig', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentSetProps(...args) {
    args = ['onSystemComponentSetProps', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentLoadProps(...args) {
    args = ['onSystemComponentLoadProps', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentDestroy(...args) {
    args = ['onSystemComponentDestroy', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentAssignIndex(...args) {
    args = ['onSystemComponentAssignIndex', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemWalkDOM(...args) {
    args = ['onSystemWalkDOM', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentAssignName(...args) {
    args = ['onSystemComponentAssignName', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemDOMElementCreate(...args) {
    //todo Dovrebbe risolvere il problema del tag doppio
    args = ['onSystemDOMElementCreate', ...args];
    callMethodNoDirective.apply(null, args);
}

module.exports = {
    directive,
    callMethod,
    extractDirectivesFromProps,

    callDOMAttributeCreate,
    
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

    callSystemAppInit,
    callSystemComponentCreate,
    callSystemComponentLoadProps,
    callSystemComponentSetConfig,
    callSystemComponentSetProps,
    callSystemComponentDestroy,
    callSystemComponentAssignIndex,
    callSystemComponentBeforeCreate,
    callSystemComponentConfigCreate,
    callSystemComponentBeforeMount,
    callSystemComponentMount,
    callSystemComponentBeforeDestroy,
    callSystemComponentUnmount,
    callSystemComponentBeforeUnmount,
    callSystemComponentAfterRender,
    callSystemComponentDrawByParent,
    callSystemComponentUpdate,
    callSystemComponentBeforeUpdate,
    callSystemComponentMountAsync,
    callSystemWalkDOM,
    callSystemComponentAssignName,
    callSystemDOMElementCreate
};