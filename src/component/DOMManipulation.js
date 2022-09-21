import canDecode from "../utils/canDecode.js";
import composeStyleInner from "../utils/composeStyleInner.js";
import dashToCamel from "../utils/dashToCamel.js";
import Base from "./Base.js";
import { COMPONENT_DYNAMIC_INSTANCE, COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, PROPS_ATTRIBUTES, DEFAULT_SLOT_KEY, TAG } from "../constants.js";
import directive from "../directives/index.js";
import { isDirective } from "../directives/helpers.js";
import makeSureAttach from "./makeSureAttach.js";
import doCreateInstance from "./doCreateInstance.js";

class DOMManipulation extends Base {
    constructor(opt) {
        super(opt);
    }
    $$afterNodeElementCreate($el, node, initial) {
        if ($el._dozAttach.hasDirective) {
            directive.callAppDOMElementCreate(this, $el, node, initial);
            directive.callComponentDOMElementCreate(this, $el, initial);
        }
        if (typeof $el.hasAttribute === 'function') {
            if (node.type.indexOf('-') !== -1 && !initial) {
                //this._processing.push({ node: $el, action: 'create' });
                doCreateInstance(this, $el)
            }

            if ($el.nodeName === TAG.SLOT_UPPERCASE) {
                let slotName = $el._dozAttach[PROPS_ATTRIBUTES] ? $el._dozAttach[PROPS_ATTRIBUTES].name : null;
                if (!slotName) {
                    this._defaultSlot = $el;
                    slotName = DEFAULT_SLOT_KEY;
                }
                if (this._slots[slotName] === undefined) {
                    this._slots[slotName] = [$el];
                }
                else {
                    this._slots[slotName].push($el);
                }
                this._hasSlots = true;
            }
        }
    }
    // noinspection JSMethodCanBeStatic
    $$beforeNodeChange($parent, $oldElement, newNode, oldNode) {
        if (typeof newNode === 'string' && typeof oldNode === 'string' && $oldElement) {
            if ($parent.nodeName === 'SCRIPT') {
                // it could be heavy
                if ($parent.type === 'text/style' && $parent._dozAttach.styleData.id && $parent._dozAttach.styleData.owner && document.getElementById($parent._dozAttach.styleData.id)) {
                    document.getElementById($parent._dozAttach.styleData.id).textContent = composeStyleInner(newNode, $parent._dozAttach.styleData.ownerByData);
                }
            }
            else {
                $oldElement.textContent = canDecode(newNode);
            }
            return $oldElement;
        }
    }
    // noinspection JSMethodCanBeStatic
    $$afterNodeChange($newElement, $oldElement) {
        makeSureAttach($oldElement);
        makeSureAttach($newElement);
        //Re-assign CMP COMPONENT_DYNAMIC_INSTANCE to new element
        if ($oldElement._dozAttach[COMPONENT_ROOT_INSTANCE]) {
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE] = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE];
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement = $newElement;
            $newElement._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid = $oldElement._dozAttach[COMPONENT_ROOT_INSTANCE].uId;
        }
    }
    // noinspection JSMethodCanBeStatic
    $$beforeNodeWalk($parent, index, attributesUpdated) {
        if ($parent.childNodes[index]) {
            makeSureAttach($parent.childNodes[index]);
            const dynInstance = $parent.childNodes[index]._dozAttach[COMPONENT_DYNAMIC_INSTANCE];
            // Can update props of dynamic instances?
            if (dynInstance && attributesUpdated.length) {
                attributesUpdated.forEach(props => {
                    Object.keys(props).forEach(name => {
                        dynInstance.props[name] = props[name];
                    });
                });
                return true;
            }
        }
        return false;
    }
    // noinspection JSMethodCanBeStatic
    /*$$afterAttributeCreate($target, name, value, nodeProps) {
    }*/
    // noinspection JSMethodCanBeStatic
    /*$$afterAttributesCreate($target, bindValue) {
    }*/
    $$afterAttributeUpdate($target, name, value) {
        let _isDirective = isDirective(name);
        if (this.updateChildrenProps && $target) {
            //name = REGEX.IS_DIRECTIVE.test(name) ? name : dashToCamel(name);
            name = _isDirective ? name : dashToCamel(name);
            const firstChild = $target.firstChild;
            makeSureAttach(firstChild);
            if (firstChild && firstChild._dozAttach[COMPONENT_ROOT_INSTANCE] && Object.prototype.hasOwnProperty.call(firstChild._dozAttach[COMPONENT_ROOT_INSTANCE]._publicProps, name)) {
                firstChild._dozAttach[COMPONENT_ROOT_INSTANCE].props[name] = value;
            }
            else if ($target._dozAttach[COMPONENT_INSTANCE]) {
                $target._dozAttach[COMPONENT_INSTANCE].props[name] = value;
            }
        }
        directive.callComponentDOMElementUpdate(this, $target);
        //if ($target && REGEX.IS_DIRECTIVE.test(name)) {
        if ($target && _isDirective) {
            $target.removeAttribute(name);
        }
    }
}
export default DOMManipulation;
