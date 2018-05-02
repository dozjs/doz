const {attach, updateAttributes} = require('./attributes');
const deadChildren = [];

function isChanged(nodeA, nodeB) {
    /*if (nodeB && nodeB.props)
    console.log(nodeB.props.updatepls)*/
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial) {
    if (typeof node === 'undefined') return;

    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);

    //console.log(node);

    attach($el, node.props, cmp);

    node.children
        .map(item => create(item, cmp, initial))
        .forEach($el.appendChild.bind($el));

    if (node.type.indexOf('-')!== -1 && !initial) {
        //$el.dataset.processed = true;
        cmp._processing.push({node: $el, action: 'create'});
    }

    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp, initial) {

    if (!oldNode) {
        console.log('create')
        const rootElement = create(newNode, cmp, initial);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        console.log('remove')
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    } else if (isChanged(newNode, oldNode)) {
        console.log('changed', newNode)
        const rootElement = create(newNode, cmp, initial);
        //console.log(rootElement);
        $parent.replaceChild(
            rootElement,
            $parent.childNodes[index]
        );
        return rootElement;
    } else if (newNode.type) {
        console.log('update')
        let updated = updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props,
            cmp
        );

        if (newNode.props.dynamic && updated) {
            cmp._processing.push({node: $parent.childNodes[index], action: 'update'});
            return;
        }

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;

        for (let i = 0; i < newLength || i < oldLength; i++) {
            //console.log(newNode.children[i].props);
            update(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i,
                cmp,
                initial
            );
        }

        clearDead();
    }
}

function clearDead() {
    let dl = deadChildren.length;

    while (dl--) {
        deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create,
    update
};