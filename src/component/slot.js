const {ATTR, TAG} = require('../constants');

function slot(cmp) {

    const cmpHTML = cmp.getHTMLElement();

    const nodeList = cmpHTML.children;

    if (nodeList.length > 1) {
        // Remove from DOM
        const rootNode = cmpHTML.removeChild(nodeList[0]);
        const dSlots = Array.from(rootNode.getElementsByTagName(TAG.SLOT));
        const dSlotsByNames = {};

        dSlots.forEach(slot => {
            if (slot.hasAttribute('name'))
                dSlotsByNames[slot.getAttribute('name')] = slot;
        });

        if (dSlots.length) {
            let slot = dSlots[0];
            while (cmpHTML.hasChildNodes()) {
                // By default get always the first
                let node = cmpHTML.childNodes[0];
                if (node.nodeType === 1) {
                    let attrSlotName = node.getAttribute(ATTR.SLOT);
                    // If the node has the name attribute,
                    // try to search inside db and assign it as destination slot
                    if (attrSlotName) {
                        if (dSlotsByNames[attrSlotName]) {
                            slot = dSlotsByNames[attrSlotName];
                        }
                        node.removeAttribute(ATTR.SLOT);
                    }
                }

                /*
                if (!slot.firstChild) {
                    const slotRoot = document.createElement(TAG.ROOT);
                    slot.appendChild(slotRoot);
                }
                */


                /*
                cmp._slotRef.push({
                    slot,
                    node
                });
*/


                // Destination node, firstChild is dz-root
                slot.appendChild(node);
            }


            if (!Object.keys(dSlotsByNames).length) {
                console.log(slot)
                dSlotsByNames[''] = slot;
            }

            cmp._slotRef = dSlotsByNames;

            // Re-append to the DOM
            cmpHTML.appendChild(rootNode);
        }

    }
}

module.exports = slot;