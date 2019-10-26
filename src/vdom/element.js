const {attach, updateAttributes} = require('./attributes');
const {TAG, NS, COMPONENT_INSTANCE, COMPONENT_ROOT_INSTANCE, DEFAULT_SLOT_KEY} = require('../constants');
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

function create(node, cmp, initial, cmpParent) {
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

    //console.log(node.type, node.targetDefaultSlot);

    if (node.props && node.props.slot && !node.isNewSlotEl) {
        return  document.createComment(`slot(${node.props.slot})`);
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

    attach($el, node.props, cmp, cmpParent);

    //console.log($el);

    node.children
        .map(item => create(item, cmp, initial, cmpParent))
        .forEach($el.appendChild.bind($el));

    cmp.$$afterNodeElementCreate($el, node, initial);
    //console.log(cmpParent)

    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp, initial, cmpParent) {

    if (newNode && newNode.cmp)
        cmp = newNode.cmp;

    if (!$parent) return;

    if (newNode.key) {
        //console.log('new node key', newNode.props.key, 'at index', index, 'dozKey', $parent.childNodes[index]);
    }

    if (oldNode && oldNode.key) {
        //console.log('old node key', oldNode.props.key, 'at index', index, 'dozKey', $parent.childNodes[index]);
    }

    if (cmpParent && $parent[COMPONENT_INSTANCE]) {

        let result = hooks.callDrawByParent($parent[COMPONENT_INSTANCE], newNode, oldNode);
        if (result !== undefined && result !== null && typeof result === 'object') {
            newNode = result.newNode || newNode;
            oldNode = result.oldNode || oldNode;
        }

        // Slot logic

        let propsSlot = newNode && newNode.props ? newNode.props.slot : false;

        if ($parent[COMPONENT_INSTANCE]._defaultSlot && !propsSlot) {
            propsSlot = DEFAULT_SLOT_KEY;
        }

        if (typeof newNode === 'object' && propsSlot && $parent[COMPONENT_INSTANCE]._slots[propsSlot]) {
            $parent[COMPONENT_INSTANCE]._slots[propsSlot].forEach($slot => {
                // Slot is on DOM
                if ($slot.parentNode) {
                    newNode.isNewSlotEl = true;
                    let $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
                    $newElement.removeAttribute('slot');
                    // I must replace $slot element with $newElement
                    $slot.parentNode.replaceChild($newElement, $slot);
                    // Assign at $slot a property that referred to $newElement
                    $slot.__newSlotEl = $newElement;
                } else {
                    // Now I must update $slot.__newSlotEl using update function
                    // I need to known the index of newSlotEl in child nodes list of his parent
                    let indexNewSlotEl = Array.from($slot.__newSlotEl.parentNode.children).indexOf($slot.__newSlotEl);

                    update(
                        $slot.__newSlotEl.parentNode,
                        newNode,
                        oldNode,
                        indexNewSlotEl,
                        cmp,
                        initial,
                        $parent[COMPONENT_INSTANCE] || cmpParent
                    );
                }
            });
            return;
        }
    }

    if (!oldNode) {
        //console.log('create node', $parent);
        // create node

        let $newElement;

        if ($parent.childNodes.length) {
            // If last node is a root, insert before
            let $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
            if ($lastNode[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);
                $parent.insertBefore($newElement, $lastNode);
                //console.log('$newElement', $newElement)
                return $newElement;
            }
        }
        $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);

        //console.log('$newElement', $newElement[COMPONENT_ROOT_INSTANCE])

        if ($newElement.__dozKey !== undefined) {
            if ($parent.__dozKeyList === undefined) {
                $parent.__dozKeyList = new Map();
            }
            if (!$parent.__dozKeyList.has($newElement.__dozKey)) {
                $parent.__dozKeyList.set($newElement.__dozKey, $newElement);
                console.log('new keyed node', $newElement, 'at index', index)
            }
        }

        $parent.appendChild($newElement);
        return $newElement;

    } else if (!newNode) {
        //console.log('remove node', $parent);
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }

    } else if (isChanged(newNode, oldNode)) {
        //console.log('node changes', $parent);
        // node changes
        const $oldElement = $parent.childNodes[index];
        if (!$oldElement) return;
        const canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement) return canReuseElement;

        const $newElement = create(newNode, cmp, initial, $parent[COMPONENT_INSTANCE] || cmpParent);

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
            cmp,
            $parent[COMPONENT_INSTANCE] || cmpParent
        );

        if (cmp.$$beforeNodeWalk($parent, index, attributesUpdated)) return;

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        let newNodeKeyList = [];
        let oldNodeKeyList = [];
        //console.log(newNode.children)
        //console.log(oldNode.children)

        if ((newNode.children[0] && newNode.children[0].key !== undefined) || (oldNode.children[0] && oldNode.children[0].key !== undefined)) {
            console.log(newNode.type, $parent.childNodes[index]);
            newNodeKeyList = newNode.children.map(i => i.key);
            oldNodeKeyList = oldNode.children.map(i => i.key);
            console.log(newNodeKeyList);
            console.log(oldNodeKeyList);
        }

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