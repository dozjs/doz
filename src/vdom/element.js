const {attach, updateAttributes} = require('./attributes');

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp) {
    if (typeof node === 'undefined') return;

    //console.time('create element');

    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);

    //console.log('CREATE');

    attach($el, node.props, cmp);

    node.children
        .map(item => create(item, cmp))
        .forEach($el.appendChild.bind($el));

    //console.timeEnd('create element');
    return $el;
}

const deadChildren = [];

function update($parent, newNode, oldNode, index = 0, cmp) {

    if (!oldNode) {
        const rootElement = create(newNode, cmp);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
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

        for (let i = 0; i < newLength || i < oldLength; i++) {
            update(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i,
                cmp
            );
        }

        let dl = deadChildren.length;

        while (dl--) {
            deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
            deadChildren.splice(dl, 1);
        }
    }
}

module.exports = {
    create,
    update
};