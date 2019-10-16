const canDecode = require('../utils/can-decode');
const composeStyleInner = require('../utils/compose-style-inner');
const dashToCamel = require('../utils/dash-to-camel');
const Base = require('./Base');
const {COMPONENT_DYNAMIC_INSTANCE, COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, REGEX, DEFAULT_SLOT_KEY, TAG} = require('../constants');
const directive = require('../directive');

class DOMManipulation extends Base {
    constructor(opt) {
        super(opt);
    }

    $$afterNodeElementCreate($el, node, initial) {
        directive.callAppDOMElementCreate(this, $el, node, initial);
        directive.callComponentDOMElementCreate(this, $el, initial);

        if (typeof $el.hasAttribute === 'function') {
            if (node.type.indexOf('-') !== -1 && !initial) {
                this._processing.push({node: $el, action: 'create'});
            }

            if ($el.nodeName === TAG.SLOT_UPPERCASE) {
                let slotName = $el.getAttribute('name');

                if (!slotName) {
                    this._defaultSlot = $el;
                    slotName = DEFAULT_SLOT_KEY;
                }

                if (this._slots[slotName] === undefined) {
                    this._slots[slotName] = [$el];
                } else {
                    this._slots[slotName].push($el);
                }

            }
        }

    }

    // noinspection JSMethodCanBeStatic
    $$beforeNodeChange($parent, $oldElement, newNode, oldNode) {
        if (typeof newNode === 'string' && typeof oldNode === 'string' && $oldElement) {
            if($parent.nodeName === 'SCRIPT') {
                // it could be heavy
                if ($parent.type === 'text/style' && $parent.dataset.id && $parent.dataset.owner) {
                    document.getElementById($parent.dataset.id).textContent = composeStyleInner(newNode, $parent.dataset.ownerByData);
                }
            } else {
                $oldElement.textContent = canDecode(newNode);
            }
            return $oldElement;
        }
    };

    // noinspection JSMethodCanBeStatic
    $$afterNodeChange($newElement, $oldElement) {
        //Re-assign CMP COMPONENT_DYNAMIC_INSTANCE to new element
        if ($oldElement[COMPONENT_ROOT_INSTANCE]) {
            $newElement[COMPONENT_ROOT_INSTANCE] = $oldElement[COMPONENT_ROOT_INSTANCE];
            $newElement[COMPONENT_ROOT_INSTANCE]._rootElement = $newElement;
            $newElement[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid = $oldElement[COMPONENT_ROOT_INSTANCE].uId;
        }
    };

    // noinspection JSMethodCanBeStatic
    $$beforeNodeWalk($parent, index, attributesUpdated) {
        if ($parent.childNodes[index]) {
            const dynInstance = $parent.childNodes[index][COMPONENT_DYNAMIC_INSTANCE];
            // Can update props of dynamic instances?
            if (dynInstance && attributesUpdated.length) {
                attributesUpdated.forEach(props => {
                    Object.keys(props).forEach(name => {
                        dynInstance.props[name] = props[name]
                    })
                });

                return true;
            }
        }

        return false;
    }

    // noinspection JSMethodCanBeStatic
    $$afterAttributeCreate($target, name, value, nodeProps) {
    }

    // noinspection JSMethodCanBeStatic
    $$afterAttributesCreate($target, bindValue) {
    }

    $$afterAttributeUpdate($target, name, value) {
        if (this.updateChildrenProps && $target) {
            name = REGEX.IS_DIRECTIVE.test(name) ? name : dashToCamel(name);
            const firstChild = $target.firstChild;

            if (firstChild && firstChild[COMPONENT_ROOT_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild[COMPONENT_ROOT_INSTANCE]._publicProps, name)) {
                firstChild[COMPONENT_ROOT_INSTANCE].props[name] = value;
            } else if($target[COMPONENT_INSTANCE]){
                $target[COMPONENT_INSTANCE].props[name] = value;
            }
        }

        directive.callComponentDOMElementUpdate(this, $target);
        if ($target && REGEX.IS_DIRECTIVE.test(name)) {
            $target.removeAttribute(name);
        }
    }

}

module.exports = DOMManipulation;