const {attach, updateAttributes} = require('./attributes');
const {TAG, NS, CMP_TAG_INSTANCE} = require('../constants');
const canDecode = require('../utils/can-decode');

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

    if (newNode && newNode.cmp)
        cmp = newNode.cmp;

    if (!$parent) return;

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

        // I don't understand how, but it works
        //if ($parent[CMP_TAG_INSTANCE] && $parent.nodeName !== 'X-CMP-3') {
        if ($parent[CMP_TAG_INSTANCE] === cmp) {
            //console.log($parent.nodeName, $parent[CMP_TAG_INSTANCE].tag, $parent[CMP_TAG_INSTANCE].originalChildNodesLength, cmp.tag, cmp.originalChildNodesLength);
            index += cmp.originalChildNodesLength;
        }

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
        deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create,
    update
};