function serializeProps(node) {
    const props = {};

    if (node.attributes.length)
        Array.from(node.attributes).forEach(attr => {
            //const prop = {};
            props[attr.name] = attr.nodeValue === '' ? true : attr.nodeValue;
            //props.push(prop);
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
    transform
};