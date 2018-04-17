const {attach, updateAttributes} = require('./attributes');

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);

    attach($el, node.props, cmp);

    node.children
        .map(item => create(item, cmp))
        .forEach($el.appendChild.bind($el));
    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp) {

    if (!oldNode) {
        const rootElement = create(newNode, cmp);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index])
            $parent.removeChild(
                $parent.childNodes[index]
            );
    } else if (isChanged(newNode, oldNode)) {
        const rootElement = create(newNode, cmp);
        $parent.replaceChild(
            rootElement,
            $parent.childNodes[index]
        );
        return rootElement;
    } else if (newNode.type) {
        updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props
        );

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;

        let rootElement = [];

        for (let i = 0; i < newLength || i < oldLength; i++) {
            let res = update(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i,
                cmp
            );

            if (res) rootElement = rootElement.concat(res);
        }

        if (rootElement.length)
            return rootElement;
    }
}

module.exports = {
    create,
    update
};