const {attach, updateAttributes} = require('./attributes');
const {TAG, NS, COMPONENT_INSTANCE, COMPONENT_ROOT_INSTANCE, DEFAULT_SLOT_KEY} = require('../constants');
const canDecode = require('../utils/can-decode');
const hooks = require('../component/hooks');
//const directive = require('../directives');
const makeSureAttach = require('../component/make-sure-attach');
const {scopedInner} = require('../component/helpers/style');
const {kCache} = require('./stores');

const storeElementNode = Object.create(null);
const deadChildren = [];

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function create(node, cmp, initial, cmpParent) {
    //console.log(node)
    if (typeof node === 'undefined' || Array.isArray(node) && node.length === 0) return;

    let nodeStored;
    let $el;
    //let originalTagName;

    if (typeof node !== 'object') {
        return document.createTextNode(
            // use decode only if necessary
            canDecode(node)
        );
    }

    if (!node || node.type == null || node.type[0] === '#') {
        node = {type: TAG.EMPTY, props: {}, children: []};
    }

    if (node.props && node.props.slot && !node.isNewSlotEl) {
        return document.createComment(`slot(${node.props.slot})`);
    }

    //console.log(node.type, node.props, cmp.tag)

    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    } else {
        //originalTagName = node.props['data-attributeoriginaletagname'];
        $el = node.isSVG
            ? document.createElementNS(NS.SVG, node.type)
            : document.createElement(node.type);

        storeElementNode[node.type] = $el.cloneNode(true);
    }

    //console.log(node);
    attach($el, node.props, cmp, cmpParent, node.isSVG);
    // The children with keys will be created later
    if (!node.hasKeys) {
        if (!node.children.length) {
        } else if (node.children.length === 1 && typeof node.children[0] === 'string') {
            //console.log('node.children[0]', node.children[0])
            $el.textContent = canDecode(node.children[0]);
        } else {
            for (let i = 0; i < node.children.length; i++) {
                //console.log(node.children[i])
                let $childEl = create(node.children[i], cmp, initial, cmpParent);
                if ($childEl)
                    $el.appendChild($childEl)
            }
        }
    }

    makeSureAttach($el);

    $el._dozAttach.elementChildren = node.children;
    $el._dozAttach.originalTagName = node.props['data-attributeoriginaletagname'];

    cmp.$$afterNodeElementCreate($el, node, initial);

    // Create eventually style
    if (node.style) {
        setHeadStyle(node, cmp)
    }

    return $el;
}

function setHeadStyle(node, cmp) {
    cmp.__hasStyle = true;
    let isScoped = node.styleScoped;
    const dataSetUId = cmp.uId;
    let tagByData = `[data-uid="${dataSetUId}"]`;
    scopedInner(node.style, dataSetUId, tagByData, isScoped, cmp);
}
//let xy = 0;
function update($parent, newNode, oldNode, index = 0, cmp, initial, cmpParent) {

    //directive.callComponentVNodeTick(cmp, newNode, oldNode);
    //console.log('a')
    //console.log(newNode)
    /*if (newNode === oldNode && $parent._dozAttach && $parent._dozAttach.componentRootInstance) {
        //console.log('uguali', newNode.type, $parent._dozAttach.componentRootInstance)
        console.log('uguali', newNode.type, cmpParent)
    }*/

    // For the moment I exclude the check on the comparison between newNode and oldNode
    // only if the component is DZ-MOUNT because the slots do not work
    if (!$parent || (newNode === oldNode && cmp.tag !== TAG.MOUNT)) return;

    if (newNode && newNode.cmp)
        cmp = newNode.cmp;

    // Update style
    if (newNode && oldNode && newNode.style !== oldNode.style) {
        setHeadStyle(newNode, cmp)
    }
    //console.log(JSON.stringify(newNode, null, 4))
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
            //console.log(newNode === oldNode)
            //console.log(JSON.stringify(newNode, null, 4))
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
    //if (oldNode === undefined || oldNode == null) {
        //console.log('create node', newNode.type);
        // create node

        let $newElement;

        if ($parent.childNodes.length) {
            // If last node is a root, insert before
            let $lastNode = $parent.childNodes[$parent.childNodes.length - 1];
            makeSureAttach($lastNode);
            if ($lastNode._dozAttach[COMPONENT_ROOT_INSTANCE]) {
                $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $parent.insertBefore($newElement, $lastNode);
                return $newElement;
            }
        }

        makeSureAttach($parent);
        $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
        //console.log('append to', $parent, cmp.uid);
        $parent.appendChild($newElement);
        return $newElement;

    } else if (!newNode) {
    //} else if (newNode === undefined || newNode == null) {
        //console.log('remove node', $parent);
        // remove node
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }

    } else if (isChanged(newNode, oldNode)) {
        //console.log('newNode changes', newNode);
        //console.log('oldNode changes', oldNode);
        // node changes
        const $oldElement = $parent.childNodes[index];
        if (!$oldElement) return;
        const canReuseElement = cmp.$$beforeNodeChange($parent, $oldElement, newNode, oldNode);
        if (canReuseElement) return canReuseElement;
        const $newElement = create(newNode, cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);

        //console.log(newNode.type, oldNode.type)

        $parent.replaceChild(
            $newElement,
            $oldElement
        );
        cmp.$$afterNodeChange($newElement, $oldElement);

        // Provo a cancellare eventuale istanza
        if ($oldElement._dozAttach && $oldElement._dozAttach[COMPONENT_INSTANCE]) {
            $oldElement._dozAttach[COMPONENT_INSTANCE].unmount();
            $oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
        }

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
        // console.log(newNode.type, $myListParent);
        let newNodeKeyList = newNode.children.map(i => i.key);
        let oldNodeKeyList = oldNode.children.map(i => i.key);

        // here my new logic for keys

        // Check if $myListParent has _dozAttach.keyList
        if ($myListParent._dozAttach.keyList === undefined) {
            $myListParent._dozAttach.keyList = new Map();
        }

        let oldKeyDoRemove = oldNodeKeyList.filter(x => !newNodeKeyList.includes(x));
         //console.log('diff', oldKeyDoRemove)
        // Ci sono key da rimuovere?
        for (let i = 0; i < oldKeyDoRemove.length; i++) {
            if ($myListParent._dozAttach.keyList.has(oldKeyDoRemove[i])) {
                let $oldElement = $myListParent._dozAttach.keyList.get(oldKeyDoRemove[i]);
                ////console.log('da rimuovere', $oldElement);
                if ($oldElement._dozAttach[COMPONENT_INSTANCE]) {
                    $oldElement._dozAttach[COMPONENT_INSTANCE].destroy();
                } else {
                    $myListParent.removeChild($oldElement);
                }
                $myListParent._dozAttach.keyList.delete(oldKeyDoRemove[i]);
                //delete kCache[oldKeyDoRemove[i]];
                kCache.delete(oldKeyDoRemove[i]);
                //console.log('cancellato in posizione', oldKeyDoRemove[i], i)
            }
        }

        //console.log(oldKeyDoRemove)
        //console.log(newNodeKeyList)

        if (oldKeyDoRemove.length) {
            // Remove from old the removed keys so preventing diff position
            oldNodeKeyList = oldNodeKeyList.filter(x => !~oldKeyDoRemove.indexOf(x));
        }

        let listOfElement = [];

        let diffIndex = []
        let diffIndexMap = Object.create(null);

        for (let i = 0; i < newNodeKeyList.length; i++) {
            if (newNodeKeyList[i] !== oldNodeKeyList[i]) {
                //console.log('indice diverso ', i)
                diffIndex.push(i);
                diffIndexMap[i] = true;
            }
            // This is the key of all
            let theKey = newNodeKeyList[i];
            // console.log('esiste nella mappa?', newNode.children[i].props.key,$myListParent._dozAttach.keyList.has(newNode.children[i].props.key))
            let $element = $myListParent._dozAttach.keyList.get(theKey);
            // Se non esiste creo il nodo
            if (!$element) {
                let $newElement = create(newNode.children[i], cmp, initial, $parent._dozAttach[COMPONENT_INSTANCE] || cmpParent);
                $myListParent._dozAttach.keyList.set(theKey, $newElement);
                // console.log('elemento creato', $newElement);
                // appendo per il momento
                listOfElement.push($newElement);
                //$myListParent.appendChild($newElement);
            } else {
                // Get the child from newNode and oldNode by the same key
                /*let newChildByKey = getChildByKey(theKey, newNode.children);
                let oldChildByKey = getChildByKey(theKey, oldNode.children);*/

                //if (!kCache[theKey].isChanged) continue;

                /*let newChildByKey = kCache[theKey].next;// getChildByKey(theKey, newNode.children);
                let oldChildByKey = kCache[theKey].prev;// getChildByKey(theKey, oldNode.children);*/

                let _kCacheValue = kCache.get(theKey);
                let newChildByKey = _kCacheValue.next;// getChildByKey(theKey, newNode.children);
                let oldChildByKey = _kCacheValue.prev;// getChildByKey(theKey, oldNode.children);

                //console.log(theKey, kCache[theKey].isChanged)

                if (!newChildByKey.children)
                    newChildByKey.children = [];

                if (!oldChildByKey.children)
                    oldChildByKey.children = [];

                listOfElement.push($element);

                //if (kCache[theKey].isChanged) {
                if (_kCacheValue.isChanged) {
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
                }

                const newChildByKeyLength = newChildByKey.children.length;
                const oldChildByKeyLength = oldChildByKey.children.length;

                //console.log(diffIndex)
                for (let i = 0; i < newChildByKeyLength || i < oldChildByKeyLength; i++) {
                    if (newChildByKey.children[i] === undefined || oldChildByKey.children[i] === undefined) continue;
                    //console.log(newChildByKey.children[i])
                    //console.log(oldChildByKey.children[i])
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
        //console.log(diffIndex);
        // No differences so exit or items are removed
        if (diffIndex[0] === undefined /*|| oldKeyDoRemove.length*/) return;

        // If first item index is equal to childNodes length then just append..
        if ($myListParent.childNodes.length === diffIndex[0]) {
            for (let i = 0; i < listOfElement.length; i++) {
                $myListParent.appendChild(listOfElement[i]);
            }
            return;
        }

        //return ;
        let useIndexI = true;
        let $currentElementAtPosition;
        let $element;

        let i = 0;
        let j = listOfElement.length - 1;

        // Try to reorder the list...
        while (i <= j) {
            //console.log(i)
            if (useIndexI) {
                $currentElementAtPosition = $myListParent.childNodes[i];
                $element = listOfElement[i];
                if (diffIndexMap[i]) {
                //if (diffIndex.indexOf(i) > -1) {
                    if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== i) {
                        //console.log('MOVE I, ', i)
                        $myListParent.insertBefore($element, $currentElementAtPosition);
                        useIndexI = false;
                    }
                }
                i++;
            } else {
                $currentElementAtPosition = $myListParent.childNodes[j];
                $element = listOfElement[j];
                if (diffIndexMap[j]) {
                //if (diffIndex.indexOf(j) > -1) {
                    if (Array.prototype.indexOf.call($myListParent.childNodes, $element) !== j) {
                        //console.log('MOVE J, ', j)
                        if ($currentElementAtPosition)
                            $myListParent.insertBefore($element, $currentElementAtPosition.nextSibling);
                        else {
                            $myListParent.appendChild($element);
                            j++
                        }
                        useIndexI = true;
                    }
                }
                j--;
            }
        }

        //console.log('$myListParent ', Array.from($myListParent.childNodes).map(item => item._dozAttach.key))
        //console.log('----------------');
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
    //console.log(key, children)
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
        if (deadChildren[dl]._dozAttach && deadChildren[dl]._dozAttach[COMPONENT_INSTANCE]) {
            deadChildren[dl]._dozAttach[COMPONENT_INSTANCE].unmount();
            deadChildren[dl]._dozAttach[COMPONENT_INSTANCE].destroy();
        }
        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create,
    update
};