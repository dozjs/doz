const castStringTo = require('../utils/cast-string-to');

function serializeProps(node) {
    const props = {};

    if (node.attributes.length)
        Array.from(node.attributes).forEach(attr => {
            props[attr.name] = attr.nodeValue === '' ? true : castStringTo(attr.nodeValue);
        });

    return props;
}

function transform(node) {

    let root = {};

    function walking(node, parent) {
        do {
            let obj;
            if (node.nodeType === 3) {
                obj = node.nodeValue;
            } else {
                obj = {};
                obj.type = node.nodeName.toLowerCase();
                obj.children = [];
                obj.props = serializeProps(node);
            }

            if (!Object.keys(root).length)
                root = obj;

            if (parent && parent.children) {
                parent.children.push(obj);
            }

            if (node.hasChildNodes()) {
                walking(node.firstChild, obj);
            }
        } while (node = node.nextSibling)

    }

    walking(node, root);

    return root;
}

module.exports = {
    transform,
    serializeProps
};