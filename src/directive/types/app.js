const {data} = require('../../collection');

// All methods that starts with prefix callApp are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id

function callMethod(...args) {
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

function callAppInit(...args) {
    args = ['onAppInit', ...args];
    callMethod.apply(null, args);
}

function callAppComponentCreate(...args) {
    args = ['onAppComponentCreate', ...args];
    callMethod.apply(null, args);
}

function callAppComponentBeforeCreate(...args) {
    args = ['onAppComponentBeforeCreate', ...args];
    callMethod.apply(null, args);
}

function callAppComponentConfigCreate(...args) {
    args = ['onAppComponentConfigCreate', ...args];
    callMethod.apply(null, args);
}

function callAppComponentBeforeMount(...args) {
    args = ['onAppComponentBeforeMount', ...args];
    callMethod.apply(null, args);
}

function callAppComponentMount(...args) {
    args = ['onAppComponentMount', ...args];
    callMethod.apply(null, args);
}

function callAppComponentMountAsync(...args) {
    args = ['onAppComponentMountAsync', ...args];
    callMethod.apply(null, args);
}

function callAppComponentBeforeUpdate(...args) {
    args = ['onAppComponentBeforeUpdate', ...args];
    callMethod.apply(null, args);
}

function callAppComponentUpdate(...args) {
    args = ['onAppComponentUpdate', ...args];
    callMethod.apply(null, args);
}

function callAppComponentDrawByParent(...args) {
    args = ['onAppComponentDrawByParent', ...args];
    callMethod.apply(null, args);
}

function callAppComponentAfterRender(...args) {
    args = ['onAppComponentAfterRender', ...args];
    callMethod.apply(null, args);
}

function callAppComponentBeforeUnmount(...args) {
    args = ['onAppComponentBeforeUnmount', ...args];
    callMethod.apply(null, args);
}

function callAppComponentUnmount(...args) {
    args = ['onAppComponentUnmount', ...args];
    callMethod.apply(null, args);
}

function callAppComponentBeforeDestroy(...args) {
    args = ['onAppComponentBeforeDestroy', ...args];
    callMethod.apply(null, args);
}

function callAppComponentSetConfig(...args) {
    args = ['onAppComponentSetConfig', ...args];
    callMethod.apply(null, args);
}

function callAppComponentSetProps(...args) {
    args = ['onAppComponentSetProps', ...args];
    callMethod.apply(null, args);
}

function callAppComponentLoadProps(...args) {
    args = ['onAppComponentLoadProps', ...args];
    callMethod.apply(null, args);
}

function callAppComponentDestroy(...args) {
    args = ['onAppComponentDestroy', ...args];
    callMethod.apply(null, args);
}

function callAppComponentAssignIndex(...args) {
    args = ['onAppComponentAssignIndex', ...args];
    callMethod.apply(null, args);
}

function callAppWalkDOM(...args) {
    args = ['onAppWalkDOM', ...args];
    callMethod.apply(null, args);
}

function callAppComponentAssignName(...args) {
    args = ['onAppComponentAssignName', ...args];
    callMethod.apply(null, args);
}
function callAppComponentPropsAssignName(...args) {
    args = ['onAppComponentPropsAssignName', ...args];
    callMethod.apply(null, args);
}

function callAppDOMElementCreate(...args) {
    //todo Dovrebbe risolvere il problema del tag doppio
    args = ['onAppDOMElementCreate', ...args];
    callMethod.apply(null, args);
}

/*function callAppDOMAttributeSet(...args) {
    args = ['onAppDOMAttributeSet', ...args];
    callMethod.apply(null, args);
}*/

module.exports = {
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
    //callAppDOMAttributeSet,
    callAppComponentPropsAssignName
};