const {COMPONENT_DYNAMIC_INSTANCE} = require('../constants');
const directive = require('../directive');

function drawDynamic(instance) {

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        const dynamicInstance = require('./instances').get({
            root,
            template: item.node.outerHTML,
            app: instance.app,
            parent: instance
        });

        if (dynamicInstance) {

            // Replace with dynamic instance original node
            //console.log('....', item.node.outerHTML, dynamicInstance._rootElement.parentNode.outerHTML)
            root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);

            // if original node has children
            if (item.node.childNodes.length) {
                // replace again -.-
                root.replaceChild(item.node, dynamicInstance._rootElement.parentNode);
                // and append root element of dynamic instance :D
                item.node.appendChild(dynamicInstance._rootElement);
            }

            dynamicInstance._rootElement.parentNode[COMPONENT_DYNAMIC_INSTANCE] = dynamicInstance;
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