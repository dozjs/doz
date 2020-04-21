const {attach, updateAttributes} = require('./attributes');
const {TAG, NS, COMPONENT_INSTANCE, COMPONENT_ROOT_INSTANCE, DEFAULT_SLOT_KEY} = require('../constants');
const canDecode = require('../utils/can-decode');
const hooks = require('../component/hooks');
const directive = require('../directives');
const makeSureAttach = require('../component/make-sure-attach');

const storeElementNode = Object.create(null);
const deadChildren = [];

function isChanged(nodeA, nodeB) {
    return  typeof nodeA !== typeof nodeB ||
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

    if (node.props && node.props.slot && !node.isNewSlotEl) {
        return  document.createComment(`slot(${node.props.slot})`);
    }

    ////console.log(node.type, node.props, cmp.tag)

    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    } else {
        $el = node.isSVG
            ? document.createElementNS(NS.SVG, node.type)
            : document.createElement(node.type);

        storeElementNode[node.type] = $el.cloneNode(true);
    }

    attach($el, node.props, cmp, cmpParent, node.isSVG);
    // The children with keys will be created later
    if (!node.hasKeys) {
        if (!node.children.length) {
        } else if (node.children.length === 1 && typeof node.children[0] === 'string') {
            $el.textContent = canDecode(node.children[0]);
        } else {
            for (let i = 0; i < node.children.length; i++) {
                let $childEl = create(node.children[i], cmp, initial, cmpParent);
                $el.appendChild($childEl)
            }
        }
    }

    makeSureAttach($el);

    $el._dozAttach.elementChildren = node.children;

    cmp.$$afterNodeElementCreate($el, node, initial);

    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp, initial, cmpParent) {

    //directive.callComponentVNodeTick(cmp, newNode, oldNode);

    if (newNode && newNode.cmp)
        cmp = newNode.cmp;

    if (!$parent) return;

    if (cmpParent && $parent._dozAttach[COMPONENT_INSTANCE]) {

        let result = hooks.callDrawByParent($parent._dozAttach[COMPONENT_INSTANCE], newNode, oldNode);
        if (result !== undefined && result !== null && typeof result === 'object') {
            newNode = result.newNode || newNode;
            oldNode = result.oldNode || oldNode;
        }

        // Slot logic

        let propsSlot = newNode && newNode.props ? newNode.props.slot : false;

        if ($parent._dozAttach[COMPONENT_INSTANCE]._defaultSlot && !propsSlot) {
            propsSlot = DEFAULT_SLOT_KEY;
        }

        if (typeof newNode === 'object' && propsSlot && $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot]) {
            $parent._dozAttach[COMPONENT_INSTANCE]._slots[propsSlot].forEach($slot => {
                // Slot is on DOM
                if ($slot.parentNode) {
                    newNode.isNewSlotEl = true;
                    let $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
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
                        $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent
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
            makeSureAttach($lastNode);
            if ($lastNode._dozAttach[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $parent.insertBefore($newElement, $lastNode);
                ////console.log('$newElement', $newElement)
                return $newElement;
            }
        }

        ////console.log(newNode)

        makeSureAttach($parent);
        $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);

        $parent.appendChild($newElement);
        return $newElement;

    } else if (!newNode) {
        //console.log('remove node', $parent);
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }

    } else if (isChanged(newNode, oldNode)) {
        //console.log('node changes', newNode, oldNode);
        // node changes
        const $oldElement = $parent.childNodes[index];
        if (!$oldElement) return;
        const canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement) return canReuseElement;

        const $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);

        $parent.replaceChild(
            $newElement,
            $oldElement
        );

        cmp.$$afterNodeChange($newElement, $oldElement);

        return $newElement;
    } else if (newNode.hasKeys !== undefined || oldNode.hasKeys !== undefined) {
        //console.log('key')
        // Children could be keys.
        // Every time there are update operation of the list should be enter here.
        // These operations are done only for the first level of nodes for example
        // <ul>
        //      <li>other1</li>
        //      <li>other2</li>
        //      <li>other3</li>
        // </ul>
        // Only the "LI" tags will be processed with this algorithm.
        // The content of the "LI" tag will be processed by the normal "update" function

        let $myListParent = $parent.childNodes[index];
        ////console.log(newNode.type, $myListParent);
        let newNodeKeyList = newNode.children.map(i => i.key);
        let oldNodeKeyList = oldNode.children.map(i => i.key);
        ////console.log(newNodeKeyList);
        ////console.log(oldNodeKeyList);
        // here my new logic for keys

        // Check if $myListParent has _dozAttach.keyList
        if ($myListParent._dozAttach.keyList === undefined) {
            $myListParent._dozAttach.keyList = new Map();
        }

        let oldKeyDoRemove = oldNodeKeyList.filter(x => !newNodeKeyList.includes(x));
        ////console.log('diff', oldKeyDoRemove)
        // Ci sono key da rimuovere?
        for (let i = 0; i < oldKeyDoRemove.length; i++) {
            if ($myListParent._dozAttach.keyList.has(oldKeyDoRemove[i])) {
                let $oldElement = $myListParent._dozAttach.keyList.get(oldKeyDoRemove[i]);
                ////console.log('da rimuovere', $oldElement);
                if($oldElement._dozAttach[COMPONENT_INSTANCE]) {
                    $oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
                } else {
                    $myListParent.removeChild($oldElement);
                }
                $myListParent._dozAttach.keyList.delete(oldKeyDoRemove[i]);
            }
        }

        let listOfElement = [];

        for (let i = 0; i < newNodeKeyList.length; i++) {
            // This is the key of all
            let theKey = newNodeKeyList[i];
            ////console.log('esiste nella mappa?', newNode.children[i].props.key,$myListParent._dozAttach.keyList.has(newNode.children[i].props.key))
            let $element = $myListParent._dozAttach.keyList.get(theKey);
            // Se non esiste creo il nodo
            if (!$element) {
                let $newElement = create(newNode.children[i], cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $myListParent._dozAttach.keyList.set(theKey, $newElement);
                ////console.log('elemento creato', $newElement);
                // appendo per il momento
                listOfElement.push($newElement);
                //$myListParent.appendChild($newElement);
            } else {
                // Get the child from newNode and oldNode by the same key
                let newChildByKey = getChildByKey(theKey, newNode.children);
                let oldChildByKey = getChildByKey(theKey, oldNode.children);

                ////console.log('aaaaaaaaaaa')
                listOfElement.push($element);
                // Update attributes?
                // Remember that the operation must be on the key and not on the index
                updateAttributes(
                    $element,
                    newChildByKey.props,
                    oldChildByKey.props,
                    cmp,
                    $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent,
                    newChildByKey.isSVG
                );
                // Here also update function using the key
                // update(...

                const newChildByKeyLength = newChildByKey.children.length;
                const oldChildByKeyLength = oldChildByKey.children.length;

                ////console.log(newChildByKey.children[i])
                ////console.log(oldChildByKey.children[i])

                /**/
                for (let i = 0; i < newChildByKeyLength || i < oldChildByKeyLength; i++) {
                    if (newChildByKey.children[i] === undefined && oldChildByKey.children[i] === undefined) continue;
                    //console.log('000')
                    update(
                        $element,
                        newChildByKey.children[i],
                        oldChildByKey.children[i],
                        i,
                        cmp,
                        initial,
                        $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent
                    );
                }
            }
        }

        if (!$myListParent.childNodes.length) {
            for (let i = 0; i < listOfElement.length; i++) {
                $myListParent.appendChild(listOfElement[i]);
            }
            return ;
        }

        //console.log('aaa');

        let diff = 0;
        for (let i = 0; i < listOfElement.length; i++) {
            let $currentElementAtPosition = $myListParent.childNodes[i + diff];
            let $element = listOfElement[i];
            if (
                ($currentElementAtPosition && $element && $currentElementAtPosition._dozAttach.key === $element._dozAttach.key)
                || Array.from($myListParent.childNodes).indexOf($element) === i) {
                continue;
            }
            diff++;
            $myListParent.insertBefore($element, $currentElementAtPosition);
        }

    } else if (newNode.type) {
        //console.log('walk node', newNode.type)
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
        if ($parent._dozAttach[COMPONENT_INSTANCE] === cmp && $parent.childNodes.length) {
            // subtract 1 (should be dz-root) to child nodes length
            // check if last child node is a root of the component
            let lastIndex = $parent.childNodes.length - 1;
            if ($parent.childNodes[lastIndex]._dozAttach[COMPONENT_ROOT_INSTANCE])
                index += lastIndex;
        }

        let attributesUpdated = updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props,
            cmp,
            $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent,
            newNode.isSVG
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
                $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent
            );
        }

        clearDead();
    }
}

function getChildByKey(key, children) {
    let res = {};
    for (let i = 0; i < children.length; i++) {
        if (key === children[i].key) {
            res = children[i];
            break;
        }
    }
    return res;
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