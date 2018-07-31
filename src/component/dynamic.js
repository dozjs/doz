const {INSTANCE} = require('../constants');
const {getInstances} = require('./index');

function clear(instance) {
    let index = instance._dynamicChildren.length - 1;

    while (index >= 0) {
        let item = instance._dynamicChildren[index];

        if (!document.body.contains(item) && item[INSTANCE]) {
            item[INSTANCE].destroy(true);
            instance._dynamicChildren.splice(index, 1);
        }
        index -= 1;
    }
}

function draw(instance) {
    clear(instance);

    let index = instance._processing.length - 1;

    while (index >= 0) {
        let item = instance._processing[index];
        let root = item.node.parentNode;

        if (item.node[INSTANCE]) {
            item.node[INSTANCE].destroy(true);
        }

        //console.log(instance._processing[index].node.innerHTML)
        if(item.node.innerHTML === '') {

            const dynamicInstance = getInstances({root, template: item.node.outerHTML, app: instance.app});

            if (dynamicInstance) {
                instance._dynamicChildren.push(dynamicInstance._rootElement.parentNode);
                root.replaceChild(dynamicInstance._rootElement.parentNode, item.node);
                dynamicInstance._rootElement.parentNode[INSTANCE] = dynamicInstance;
                instance._processing.splice(index, 1);
            }
        }
        index -= 1;
    }
}

module.exports = {
    draw,
    clear
};