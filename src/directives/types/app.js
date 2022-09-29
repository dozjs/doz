import { data } from "../../collection.js";
import delay from "../../utils/delay.js";
// All methods that starts with prefix callApp are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id
function callMethod(...args) {
    let method = args.shift();
    let oKeys = data.directivesKeys; // Object.keys(data.directives);
    let callback;
    //let isDelayed = args[1] === 'delay'
    // Search for a possible callback
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'function') {
            callback = args[i];
            break;
        }
    }
    for (let i = 0; i < oKeys.length; i++) {
        let key = oKeys[i];
        if (data.directives[key] /*!== undefined*/) {
            //if (typeof data.directives[key][method] === 'function') {
            if (data.directives[key][method] /*!== undefined*/) {
                function callFunc() {
                    let res = data.directives[key][method].apply(data.directives[key], args);
                    // If res returns something, fire the callback
                    if (res !== undefined && callback)
                        callback(res);
                }
                /*if (isDelayed) {
                    delay(() => callFunc())
                } else {*/
                    callFunc()
                //}
            }
        }
    }
}
function callAppInit(...args) {
    let resArgs = ['onAppInit'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppInit', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentCreate(...args) {
    let resArgs = ['onAppComponentCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentBeforeCreate(...args) {
    let resArgs = ['onAppComponentBeforeCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentConfigCreate(...args) {
    let resArgs = ['onAppComponentConfigCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentConfigCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentBeforeMount(...args) {
    let resArgs = ['onAppComponentBeforeMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeMount', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentMount(...args) {
    let resArgs = ['onAppComponentMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentMount', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentMountAsync(...args) {
    let resArgs = ['onAppComponentMountAsync'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentMountAsync', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentBeforeUpdate(...args) {
    let resArgs = ['onAppComponentBeforeUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeUpdate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentUpdate(...args) {
    let resArgs = ['onAppComponentUpdate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentUpdate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentDrawByParent(...args) {
    let resArgs = ['onAppComponentDrawByParent'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentDrawByParent', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentAfterRender(...args) {
    let resArgs = ['onAppComponentAfterRender'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAfterRender', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentBeforeUnmount(...args) {
    let resArgs = ['onAppComponentBeforeUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeUnmount', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentUnmount(...args) {
    let resArgs = ['onAppComponentUnmount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentUnmount', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentBeforeDestroy(...args) {
    let resArgs = ['onAppComponentBeforeDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentBeforeDestroy', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentSetConfig(...args) {
    let resArgs = ['onAppComponentSetConfig'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentSetConfig', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentSetProps(...args) {
    let resArgs = ['onAppComponentSetProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentSetProps', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentLoadProps(...args) {
    let resArgs = ['onAppComponentLoadProps'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentLoadProps', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentDestroy(...args) {
    let resArgs = ['onAppComponentDestroy'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentDestroy', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentAssignIndex(...args) {
    let resArgs = ['onAppComponentAssignIndex'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAssignIndex', ...args];
    callMethod.apply(null, resArgs);
}
function callAppWalkDOM(...args) {
    let resArgs = ['onAppWalkDOM'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppWalkDOM', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentAssignName(...args) {
    let resArgs = ['onAppComponentAssignName'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentAssignName', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentPropsAssignName(...args) {
    let resArgs = ['onAppComponentPropsAssignName'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentPropsAssignName', ...args];
    callMethod.apply(null, resArgs);
}
function callAppDOMElementCreate(...args) {
    //todo Dovrebbe risolvere il problema del tag doppio
    let resArgs = ['onAppDOMElementCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppDOMElementCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppDynamicInstanceCreate(...args) {
    let resArgs = ['onAppDynamicInstanceCreate'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppDynamicInstanceCreate', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentRenderOverwrite(...args) {
    let resArgs = ['onAppComponentRenderOverwrite'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentRenderOverwrite', ...args];
    callMethod.apply(null, resArgs);
}
function callAppComponentWaitMount(...args) {
    let resArgs = ['onAppComponentWaitMount'];
    Array.prototype.push.apply(resArgs, args);
    //args = ['onAppComponentWaitMount', ...args];
    callMethod.apply(null, resArgs);
}
export { callAppInit };
export { callAppComponentCreate };
export { callAppComponentLoadProps };
export { callAppComponentSetConfig };
export { callAppComponentSetProps };
export { callAppComponentDestroy };
export { callAppComponentAssignIndex };
export { callAppComponentBeforeCreate };
export { callAppComponentConfigCreate };
export { callAppComponentBeforeMount };
export { callAppComponentMount };
export { callAppComponentBeforeDestroy };
export { callAppComponentUnmount };
export { callAppComponentBeforeUnmount };
export { callAppComponentAfterRender };
export { callAppComponentDrawByParent };
export { callAppComponentUpdate };
export { callAppComponentBeforeUpdate };
export { callAppComponentMountAsync };
export { callAppWalkDOM };
export { callAppComponentAssignName };
export { callAppDOMElementCreate };
export { callAppDynamicInstanceCreate };
export { callAppComponentPropsAssignName };
export { callAppComponentRenderOverwrite };
export { callAppComponentWaitMount };
export default {
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
