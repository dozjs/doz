import createInstance from "./createInstance.js";
import {COMPONENT_DYNAMIC_INSTANCE} from "../constants.js";
import directive from "../directives/index.js";

function doCreateInstance(instance, $el) {
    //console.log('creo instance', $el.outerHTML)
    let dynamicInstance = createInstance({
        root: null,
        template: $el,
        app: instance.app,
        parent: instance
    });

    if (dynamicInstance) {
        dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
        let nc = Object.keys(instance.children).length;
        instance.children[nc++] = dynamicInstance;
        if (instance.childrenByTag[dynamicInstance.tag] === undefined) {
            instance.childrenByTag[dynamicInstance.tag] = [dynamicInstance];
        }
        else {
            instance.childrenByTag[dynamicInstance.tag].push(dynamicInstance);
        }
        directive.callAppDynamicInstanceCreate(instance, dynamicInstance, { node: $el, action: 'create' });
    }
}

export default doCreateInstance