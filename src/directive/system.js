const {data} = require('../collection');

// All methods that starts with prefix callSystem are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id

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