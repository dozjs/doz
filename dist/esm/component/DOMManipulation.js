import canDecode from"../utils/can-decode.js";import composeStyleInner from"../utils/compose-style-inner.js";import dashToCamel from"../utils/dash-to-camel.js";import Base from"./Base.js";import{COMPONENT_DYNAMIC_INSTANCE,COMPONENT_ROOT_INSTANCE,COMPONENT_INSTANCE,PROPS_ATTRIBUTES,DEFAULT_SLOT_KEY,TAG}from"../constants.js";import directive from"../directives/index.js";import{isDirective}from"../directives/helpers.js";import makeSureAttach from"./make-sure-attach.js";class DOMManipulation extends Base{constructor(t){super(t)}$$afterNodeElementCreate(t,e,o){if(t._dozAttach.hasDirective&&(directive.callAppDOMElementCreate(this,t,e,o),directive.callComponentDOMElementCreate(this,t,o)),"function"==typeof t.hasAttribute&&(-1===e.type.indexOf("-")||o||this._processing.push({node:t,action:"create"}),t.nodeName===TAG.SLOT_UPPERCASE)){let e=t._dozAttach[PROPS_ATTRIBUTES]?t._dozAttach[PROPS_ATTRIBUTES].name:null;e||(this._defaultSlot=t,e=DEFAULT_SLOT_KEY),void 0===this._slots[e]?this._slots[e]=[t]:this._slots[e].push(t)}}$$beforeNodeChange(t,e,o,a){if("string"==typeof o&&"string"==typeof a&&e)return"SCRIPT"===t.nodeName?"text/style"===t.type&&t._dozAttach.styleData.id&&t._dozAttach.styleData.owner&&document.getElementById(t._dozAttach.styleData.id)&&(document.getElementById(t._dozAttach.styleData.id).textContent=composeStyleInner(o,t._dozAttach.styleData.ownerByData)):e.textContent=canDecode(o),e}$$afterNodeChange(t,e){makeSureAttach(e),makeSureAttach(t),e._dozAttach[COMPONENT_ROOT_INSTANCE]&&(t._dozAttach[COMPONENT_ROOT_INSTANCE]=e._dozAttach[COMPONENT_ROOT_INSTANCE],t._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement=t,t._dozAttach[COMPONENT_ROOT_INSTANCE]._rootElement.parentNode.dataset.uid=e._dozAttach[COMPONENT_ROOT_INSTANCE].uId)}$$beforeNodeWalk(t,e,o){if(t.childNodes[e]){makeSureAttach(t.childNodes[e]);const a=t.childNodes[e]._dozAttach[COMPONENT_DYNAMIC_INSTANCE];if(a&&o.length)return o.forEach((t=>{Object.keys(t).forEach((e=>{a.props[e]=t[e]}))})),!0}return!1}$$afterAttributeUpdate(t,e,o){let a=isDirective(e);if(this.updateChildrenProps&&t){e=a?e:dashToCamel(e);const r=t.firstChild;makeSureAttach(r),r&&r._dozAttach[COMPONENT_ROOT_INSTANCE]&&Object.prototype.hasOwnProperty.call(r._dozAttach[COMPONENT_ROOT_INSTANCE]._publicProps,e)?r._dozAttach[COMPONENT_ROOT_INSTANCE].props[e]=o:t._dozAttach[COMPONENT_INSTANCE]&&(t._dozAttach[COMPONENT_INSTANCE].props[e]=o)}directive.callComponentDOMElementUpdate(this,t),t&&a&&t.removeAttribute(e)}}export default DOMManipulation;