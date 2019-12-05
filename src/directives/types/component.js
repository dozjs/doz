const {data} = require('../../collection');
const {extractDirectivesFromProps, isDirective} = require('../helpers');
const {REGEX, PROPS_ATTRIBUTES} = require('../../constants.js');

// Hooks for the component
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

function callComponentBeforeCreate(...args) {
    let resArgs = ['onComponentBeforeCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeCreate', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentCreate(...args) {
    let resArgs = ['onComponentCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentCreate', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentBeforeMount(...args) {
    let resArgs = ['onComponentBeforeMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeMount', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentMount(...args) {
    let resArgs = ['onComponentMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentMount', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentMountAsync(...args) {
    let resArgs = ['onComponentMountAsync'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentMountAsync', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentAfterRender(...args) {
    let resArgs = ['onComponentAfterRender'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentAfterRender', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentBeforeUpdate(...args) {
    let resArgs = ['onComponentBeforeUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeUpdate', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentUpdate(...args) {
    let resArgs = ['onComponentUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentUpdate', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentBeforeUnmount(...args) {
    let resArgs = ['onComponentBeforeUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeUnmount', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentUnmount(...args) {
    let resArgs = ['onComponentUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentUnmount', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentBeforeDestroy(...args) {
    let resArgs = ['onComponentBeforeDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentBeforeDestroy', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentDestroy(...args) {
    let resArgs = ['onComponentDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentDestroy', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentLoadProps(...args) {
    let resArgs = ['onComponentLoadProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentLoadProps', ...args];
    callMethod.apply(null, resArgs)
}

function callComponentDOMElementCreate(instance, $target, initial) {
    let method = 'onComponentDOMElementCreate';
    let i = $target.attributes.length;
    while(i--) {
        let attribute = $target.attributes[i];
        if (isDirective(attribute.name)) {
            let directiveName = attribute.name.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = $target[PROPS_ATTRIBUTES][attribute.name];// || attribute.value;
            //console.log('directiveValue', directiveValue)
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                $target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial])
            }
        }
    }
}

function callComponentDOMElementUpdate(instance, $target) {
    let method = 'onComponentDOMElementUpdate';
    let i = $target.attributes.length;
    while(i--) {
        let attribute = $target.attributes[i];
        if (isDirective(attribute.name)) {
            let directiveName = attribute.name.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = $target[PROPS_ATTRIBUTES][attribute.name];// || attribute.value;
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue])
            }
        }
    }
}

module.exports = {
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
    callComponentDOMElementUpdate
};