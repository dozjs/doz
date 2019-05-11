const canDecode = require('../utils/can-decode');
const composeStyleInner = require('../utils/compose-style-inner');
const {INSTANCE, TAG, NS, CMP_INSTANCE, ATTR, DIR_IS} = require('../constants');

class DOM {

    constructor() {
        this._deadChildren = [];
    }

    _clearDead() {
        let dl = this._deadChildren.length;

        while (dl--) {
            this._deadChildren[dl].parentNode.removeChild(this._deadChildren[dl]);
            this._deadChildren.splice(dl, 1);
        }
    }

    beforeNodeElementCreate() {

    }

    nodeElementCreate(el, node, initial) {
        if (typeof el.hasAttribute === 'function')
            if ((node.type.indexOf('-') !== -1
                || (typeof el.hasAttribute === 'function' && el.hasAttribute(ATTR.IS)))
                && !initial) {
                this._processing.push({node: el, action: 'create'});
            }
    }

    beforeNodeCreate() {

    }

    nodeCreate() {

    }

    beforeNodeRemove() {

    }

    nodeRemove(parent, index) {
        if (parent.childNodes[index]) {
            this._deadChildren.push(parent.childNodes[index]);
        }
    }

    beforeNodeChange(parent, newNode, oldNode, oldElement) {
        if (typeof newNode === 'string' && typeof oldNode === 'string' && oldElement) {
            oldElement.textContent = canDecode(newNode);
            if(parent.nodeName === 'SCRIPT') {
                // it could be heavy
                if (parent.type === 'text/style' && parent.dataset.id && parent.dataset.owner) {
                    document.getElementById(parent.dataset.id).textContent = composeStyleInner(oldElement.textContent, parent.dataset.owner, parent.dataset.ownerByData);
                }
            }
            return oldElement;
        }
    };

    nodeChange(newElement, oldElement) {
        //Re-assign CMP INSTANCE to new element
        if (oldElement[CMP_INSTANCE]) {
            newElement[CMP_INSTANCE] = oldElement[CMP_INSTANCE];
            newElement[CMP_INSTANCE]._rootElement = newElement;
        }
    };

    beforeNodeWalk(parent, index, attributesUpdated) {
        if (parent.childNodes[index]) {
            const dynInstance = parent.childNodes[index][INSTANCE];
            // Can update props of dynamic instances?
            if (dynInstance && attributesUpdated.length) {
                attributesUpdated.forEach(props => {
                    Object.keys(props).forEach(name => {
                        dynInstance.props[name] = props[name]
                    })
                });

                return false;
            }
        }

        return true;
    }

    nodeWalk() {
        this._clearDead();
    }

}

module.exports = DOM;