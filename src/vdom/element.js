const {attach, updateAttributes} = require('./attributes');
const {TAG, NS, COMPONENT_INSTANCE, COMPONENT_ROOT_INSTANCE} = require('../constants');
const canDecode = require('../utils/can-decode');
const hooks = require('../component/hooks');

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

function update($parent, newNode, oldNode, index = 0, cmp, initial, cmpParent) {

    if (newNode && newNode.cmp)
        cmp = newNode.cmp;

    if (!$parent) return;

    if (cmpParent && $parent[COMPONENT_INSTANCE]) {
    //if ($parent[COMPONENT_INSTANCE]) {
    //if ($parent[COMPONENT_INSTANCE]) {
    //console.log($parent[COMPONENT_INSTANCE])
        /*console.log('UPDATE', $parent[COMPONENT_INSTANCE].tag);
        console.log('cmpParent', cmpParent.tag);
        console.log(newNode, oldNode);*/
        //console.log('on nested update')
        let result = hooks.callDrawByParent($parent[COMPONENT_INSTANCE], newNode, oldNode);
        if (result !== undefined && result !== null && typeof result === 'object') {
            newNode = result.newNode || newNode;
            oldNode = result.oldNode || oldNode;
        }
    }

    if (!oldNode) {
        // create node

        let $newElement;

        if ($parent.childNodes.length) {
            // If last node is a root, insert before
            let $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
            if ($lastNode[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial);
                $parent.insertBefore($newElement, $lastNode);
                //console.log('$newElement', $newElement)
                return $newElement;
            }
        }
        $newElement = create(newNode, cmp, initial);
        $parent.appendChild($newElement);
        //console.log('$newElement', $newElement[COMPONENT_ROOT_INSTANCE])
        return $newElement;

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

        /*
        Adjust index so it's possible update props in nested component like:

        <parent-component>
            <child-component>
                ${this.props.foo}
            </child-component>
            <child-component>
                ${this.props.bar}
            </child-component>
        </parent-component>
        */
        if ($parent[COMPONENT_INSTANCE] === cmp && $parent.childNodes.length) {
            // subtract 1 (should be dz-root) to child nodes length
            // check if last child node is a root of the component
            let lastIndex = $parent.childNodes.length - 1;
            if ($parent.childNodes[lastIndex][COMPONENT_ROOT_INSTANCE])
                index += lastIndex;
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
                initial,
                $parent[COMPONENT_INSTANCE] || cmpParent
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