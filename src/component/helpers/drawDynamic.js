const {COMPONENT_DYNAMIC_INSTANCE, PROPS_ATTRIBUTES} = require('../../constants');
const directive = require('../../directives');

function drawDynamic(instance) {

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        //console.log('create dynamic', item.node, item.node.__dozProps)
        const dynamicInstance = require('../createInstance')({
            root,
            template: item.node,
            //template: item.node.outerHTML,
            app: instance.app,
            parent: instance
        });

        if (dynamicInstance) {

            // Replace with dynamic instance original node
            //console.log('....', item.node.outerHTML, dynamicInstance._rootElement.parentNode.outerHTML)
            /*// Assign props attributes to new child
            //console.log('Assign props attributes to new child')
            if(item.node._dozAttach[PROPS_ATTRIBUTES]) {
                dynamicInstance._rootElement.parentNode._dozAttach[PROPS_ATTRIBUTES] = item.node._dozAttach[PROPS_ATTRIBUTES];
            }*/

            //root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);

            // if original node has children
            if (item.node.childNodes.length) {
                // replace again -.-
                //root.replaceChild(item.node, dynamicInstance._rootElement.parentNode);
                // and append root element of dynamic instance :D
                item.node.appendChild(dynamicInstance._rootElement);
            }

            dynamicInstance._rootElement.parentNode._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
            instance._processing.splice(index, 1);
            let n = Object.keys(instance.children).length;
            instance.children[n++] = dynamicInstance;

            if (instance.childrenByTag[dynamicInstance.tag] === undefined) {
                instance.childrenByTag[dynamicInstance.tag] = [dynamicInstance];
            } else {
                instance.childrenByTag[dynamicInstance.tag].push(dynamicInstance);
            }

            directive.callAppDynamicInstanceCreate(instance, dynamicInstance, item);
        }
        index -= 1;
    }
}

module.exports = drawDynamic;