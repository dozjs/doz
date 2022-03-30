const {data} = require('../../collection');
const {extractDirectivesFromProps, isDirective, extractDirectiveNameAndKeyValues} = require('../helpers');
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

function callComponentWaitMount(...args) {
    let resArgs = ['onComponentWaitMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onComponentWaitMount', ...args];
    callMethod.apply(null, resArgs)
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
    if(!$target._dozAttach[PROPS_ATTRIBUTES]) return;
    let keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);
    for(let i = 0; i < keys.length; i++) {
        let attributeName = keys[i];
        let attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];
        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName);// attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = attributeValue;
            //console.log('directiveValue', directiveValue)
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial, keyArgumentsValues])
            }
        }
    }
}

function callComponentDOMElementUpdate(instance, $target) {
    let method = 'onComponentDOMElementUpdate';
    if(!$target._dozAttach[PROPS_ATTRIBUTES]) return;
    let keys = Object.keys($target._dozAttach[PROPS_ATTRIBUTES]);
    for(let i = 0; i < keys.length; i++) {
        let attributeName = keys[i];
        let attributeValue = $target._dozAttach[PROPS_ATTRIBUTES][keys[i]];
        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName);// attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = attributeValue;
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                //$target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, keyArgumentsValues])
            }
        }
    }
}

function callComponentVNodeTick(instance, newNode, oldNode) {

    if (!newNode || !newNode.props) return;
    let method = 'onComponentVNodeTick';
    let propsKey = Object.keys(newNode.props);
    for (let i = 0; i < propsKey.length; i++) {
        let attributeName = propsKey[i];

        if (isDirective(attributeName)) {
            let [directiveName, keyArgumentsValues] = extractDirectiveNameAndKeyValues(attributeName);//attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = newNode.props[attributeName];// || attribute.value;
            //console.log('directiveValue',directiveName, directiveValue)
            let directiveObj = data.directives[directiveName];
            //console.log('aaaaaaa', attributeName, directiveObj)
            if (directiveObj && directiveObj[method]) {
                //delete newNode.props[attributeName];
                directiveObj[method].apply(directiveObj, [instance, newNode, oldNode, directiveValue, keyArgumentsValues])
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
    callComponentDOMElementUpdate,
    callComponentVNodeTick,
    callComponentWaitMount,
    //callComponentsMounted
};