import { COMPONENT_DYNAMIC_INSTANCE, PROPS_ATTRIBUTES } from "../../constants.js";
import directive from "../../directives/index.js";
import createInstance from "../createInstance.js";

function drawDynamic(instance) {
    let index = instance._processing.length - 1;
    //if (!instance._processing.length) return;
    //let fragment = document.createDocumentFragment();
    console.log('instance._processing', instance._processing)
    let item, root;
    while (index >= 0) {
        //for (let index = 0; index < instance._processing.length; index++) {
        console.log(index)
        item = instance._processing[index];
        //let root = item.node.parentNode;
        root = null; //item.node;

        //console.log('root', root)
        /*console.log('item', item.node)
        console.log('index', index)*/
        //root = item.node
        const dynamicInstance = createInstance({
            root,//: item.node,
            template: item.node,
            //template: item.node.outerHTML,
            app: instance.app,
            parent: instance
        });
        console.log('instance created', dynamicInstance)
        if (dynamicInstance) {
            // if original node has children
            /*if (item.node.childNodes.length) {
                item.node.appendChild(dynamicInstance._rootElement);
            }*/
            dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
            instance._processing.splice(index, 1);
            let n = Object.keys(instance.children).length;
            instance.children[n++] = dynamicInstance;
            if (instance.childrenByTag[dynamicInstance.tag] === undefined) {
                instance.childrenByTag[dynamicInstance.tag] = [dynamicInstance];
            }
            else {
                instance.childrenByTag[dynamicInstance.tag].push(dynamicInstance);
            }
            directive.callAppDynamicInstanceCreate(instance, dynamicInstance, item);
        }
        index -= 1;
    }
}

export default drawDynamic;