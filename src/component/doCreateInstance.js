//import createInstance from "./createInstance.js";
import {COMPONENT_DYNAMIC_INSTANCE} from "../constants.js";
//import directive from "../directives/index.js";

function doCreateInstance(instance, $el) {
    //console.log('creo instance', $el.outerHTML)
    let dynamicInstance = instance.app.createInstance({
        root: null,
        template: $el,
        app: instance.app,
        parent: instance
    });

    if (dynamicInstance && dynamicInstance._rootElement) {
        dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
    }
}

export default doCreateInstance