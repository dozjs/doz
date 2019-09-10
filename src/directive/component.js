const {data} = require('../collection');
const {extractDirectivesFromProps} = require('./helpers');

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
};