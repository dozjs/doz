const {attach, updateAttributes} = require('./attributes');
const {TAG, NS} = require('../constants');
const canDecode = require('../utils/can-decode');
const diffKey = require('./patch');

const storeElementNode = Object.create(null);
const deadChildren = [];

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial) {
    if (typeof node === 'undefined') return;

    let nodeStored;
    let $el;

    if (typeof node === 'string') {
        return document.createTextNode(
            // use decode only if necessary
            canDecode(node)
        );
    }

    if (node.type[0] === '#') {
        node.type = TAG.EMPTY;
    }

    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    } else {
        $el = node.isSVG
            ? document.createElementNS(NS.SVG, node.type)
            : document.createElement(node.type);

        storeElementNode[node.type] = $el.cloneNode(true);
    }

    attach($el, node.props, cmp);

    node.children
        .map(item => create(item, cmp, initial))
        .forEach($el.appendChild.bind($el));

    cmp.$$afterNodeElementCreate($el, node, initial);

    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp, initial) {

    if (!$parent) return;
    if (newNode && oldNode && oldNode.childrenHasKey) {
        const diffIndex = diffKey(newNode.children, oldNode.children);
        /*diffIndex.forEach(i => {
            if (!$parent.childNodes[index].childNodes[i] || !$parent.childNodes[index].childNodes[i].firstChild) return;
            oldNode.children.splice(i, 1);
            $parent.childNodes[index].childNodes[i].firstChild.__DOZ_CMP_INSTANCE__.destroy();
        });*/
        console.log(diffIndex)
        diffIndex.forEach(diff => {
            console.log(diff)
            if (diff.type === 'remove') {
                let newPos = diff.newPos;
                diff.items.forEach(item => {
                    console.log(item)
                    if (!$parent.childNodes[index].childNodes[newPos] || !$parent.childNodes[index].childNodes[newPos].firstChild) return;
                    oldNode.children.splice(newPos, 1);
                    console.log('aaaaaaa')
                    $parent.childNodes[index].childNodes[newPos].firstChild.__DOZ_CMP_INSTANCE__.destroy();
                })
            }
        });
        if (diffIndex.length) return
    }
    if (!oldNode) {
        // create node
        return $parent.appendChild(create(newNode, cmp, initial));

    } else if (!newNode) {
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }

    } else if (isChanged(newNode, oldNode)) {
        // node changes
        const $oldElement = $parent.childNodes[index];
        if (!$oldElement) return;
        //console.log('$oldElement', $oldElement.innerHTML);
        const canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement) return canReuseElement;

        const $newElement = create(newNode, cmp, initial);

        $parent.replaceChild(
            $newElement,
            $oldElement
        );

        cmp.$$afterNodeChange($newElement, $oldElement);

        return $newElement;

    } else if (newNode.type) {
        // walk node



        let attributesUpdated = updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props,
            cmp
        );

        if (cmp.$$beforeNodeWalk($parent, index, attributesUpdated)) return;

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;

        for (let i = 0; i < newLength || i < oldLength; i++) {
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

        cmp.$$afterNodeWalk();
    }
}

function clearDead() {
    let dl = deadChildren.length;

    while (dl--) {
        if (deadChildren[dl].firstChild && deadChildren[dl].firstChild.__DOZ_CMP_INSTANCE__) {
            deadChildren[dl].firstChild.__DOZ_CMP_INSTANCE__.destroy();
        } else {
            deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        }

        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create,
    update
};