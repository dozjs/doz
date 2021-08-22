import{attach,updateAttributes}from"./attributes.js";import{TAG,NS,COMPONENT_INSTANCE,COMPONENT_ROOT_INSTANCE,DEFAULT_SLOT_KEY}from"../constants.js";import canDecode from"../utils/can-decode.js";import hooks from"../component/hooks.js";import makeSureAttach from"../component/make-sure-attach.js";import{scopedInner}from"../component/helpers/style.js";const storeElementNode=Object.create(null),deadChildren=[];function isChanged(e,t){return typeof e!=typeof t||"string"==typeof e&&e!==t||e.type!==t.type||e.props&&e.props.forceupdate}function create(e,t,d,o){if(void 0===e||Array.isArray(e)&&0===e.length)return;let l,r;if("object"!=typeof e)return document.createTextNode(canDecode(e));if(e&&null!=e.type&&"#"!==e.type[0]||(e={type:TAG.EMPTY,props:{},children:[]}),e.props&&e.props.slot&&!e.isNewSlotEl)return document.createComment(`slot(${e.props.slot})`);if(l=storeElementNode[e.type],l?r=l.cloneNode():(r=e.isSVG?document.createElementNS(NS.SVG,e.type):document.createElement(e.type),storeElementNode[e.type]=r.cloneNode(!0)),attach(r,e.props,t,o,e.isSVG),!e.hasKeys)if(e.children.length)if(1===e.children.length&&"string"==typeof e.children[0])r.textContent=canDecode(e.children[0]);else for(let l=0;l<e.children.length;l++){let n=create(e.children[l],t,d,o);n&&r.appendChild(n)}else;return makeSureAttach(r),r._dozAttach.elementChildren=e.children,r._dozAttach.originalTagName=e.props["data-attributeoriginaletagname"],t.$$afterNodeElementCreate(r,e,d),e.style&&setHeadStyle(e,t),r}function setHeadStyle(e,t){t.__hasStyle=!0;let d=e.styleScoped;const o=t.uId;let l=`[data-uid="${o}"]`;scopedInner(e.style,o,l,d,t)}function update(e,t,d,o=0,l,r,n){if(e&&(t!==d||l.tag===TAG.MOUNT)){if(t&&t.cmp&&(l=t.cmp),t&&d&&t.style!==d.style&&setHeadStyle(t,l),n&&e._dozAttach[COMPONENT_INSTANCE]){let o=hooks.callDrawByParent(e._dozAttach[COMPONENT_INSTANCE],t,d);null!=o&&"object"==typeof o&&(t=o.newNode||t,d=o.oldNode||d);let a=!(!t||!t.props)&&t.props.slot;if(e._dozAttach[COMPONENT_INSTANCE]._defaultSlot&&!a&&(a=DEFAULT_SLOT_KEY),"object"==typeof t&&a&&e._dozAttach[COMPONENT_INSTANCE]._slots[a])return void e._dozAttach[COMPONENT_INSTANCE]._slots[a].forEach((o=>{if(o.parentNode){t.isNewSlotEl=!0;let d=create(t,l,r,e._dozAttach[COMPONENT_INSTANCE]||n);d.removeAttribute("slot"),o.parentNode.replaceChild(d,o),o.__newSlotEl=d}else{let a=Array.from(o.__newSlotEl.parentNode.children).indexOf(o.__newSlotEl);update(o.__newSlotEl.parentNode,t,d,a,l,r,e._dozAttach[COMPONENT_INSTANCE]||n)}}))}if(!d){let d;if(e.childNodes.length){let o=e.childNodes[e.childNodes.length-1];if(makeSureAttach(o),o._dozAttach[COMPONENT_ROOT_INSTANCE])return d=create(t,l,r,e._dozAttach[COMPONENT_INSTANCE]||n),e.insertBefore(d,o),d}return makeSureAttach(e),d=create(t,l,r,e._dozAttach[COMPONENT_INSTANCE]||n),e.appendChild(d),d}if(t){if(isChanged(t,d)){const a=e.childNodes[o];if(!a)return;const c=l.$$beforeNodeChange(e,a,t,d);if(c)return c;const i=create(t,l,r,e._dozAttach[COMPONENT_INSTANCE]||n);return e.replaceChild(i,a),l.$$afterNodeChange(i,a),a._dozAttach&&a._dozAttach[COMPONENT_INSTANCE]&&(a._dozAttach[COMPONENT_INSTANCE].unmount(),a._dozAttach[COMPONENT_INSTANCE].destroy()),i}if(void 0!==t.hasKeys||void 0!==d.hasKeys){let a=e.childNodes[o],c=t.children.map((e=>e.key)),i=d.children.map((e=>e.key));void 0===a._dozAttach.keyList&&(a._dozAttach.keyList=new Map);let N=i.filter((e=>!c.includes(e)));for(let e=0;e<N.length;e++)if(a._dozAttach.keyList.has(N[e])){let t=a._dozAttach.keyList.get(N[e]);t._dozAttach[COMPONENT_INSTANCE]?t._dozAttach[COMPONENT_INSTANCE].destroy():a.removeChild(t),a._dozAttach.keyList.delete(N[e]),l.app.cacheStores.kCache.delete(N[e])}N.length&&(i=i.filter((e=>!~N.indexOf(e))));let h=[],s=[],p=Object.create(null);for(let d=0;d<c.length;d++){c[d]!==i[d]&&(s.push(d),p[d]=!0);let o=c[d],N=a._dozAttach.keyList.get(o);if(N){let t=l.app.cacheStores.kCache.get(o),d=t.next,a=t.prev;d.children||(d.children=[]),a.children||(a.children=[]),h.push(N),t.isChanged&&updateAttributes(N,d.props,a.props,l,e._dozAttach[COMPONENT_INSTANCE]||n,d.isSVG);const c=d.children.length,i=a.children.length;for(let t=0;t<c||t<i;t++)void 0!==d.children[t]&&void 0!==a.children[t]&&update(N,d.children[t],a.children[t],t,l,r,e._dozAttach[COMPONENT_INSTANCE]||n)}else{let c=create(t.children[d],l,r,e._dozAttach[COMPONENT_INSTANCE]||n);a._dozAttach.keyList.set(o,c),h.push(c)}}if(void 0===s[0])return;if(a.childNodes.length===s[0]){for(let e=0;e<h.length;e++)a.appendChild(h[e]);return}let C,_,A=!0,E=0,f=h.length-1;for(;E<=f;)A?(C=a.childNodes[E],_=h[E],p[E]&&Array.prototype.indexOf.call(a.childNodes,_)!==E&&(a.insertBefore(_,C),A=!1),E++):(C=a.childNodes[f],_=h[f],p[f]&&Array.prototype.indexOf.call(a.childNodes,_)!==f&&(C?a.insertBefore(_,C.nextSibling):(a.appendChild(_),f++),A=!0),f--)}else if(t.type){if(e._dozAttach[COMPONENT_INSTANCE]===l&&e.childNodes.length){let t=e.childNodes.length-1;e.childNodes[t]._dozAttach&&e.childNodes[t]._dozAttach[COMPONENT_ROOT_INSTANCE]&&(o+=t)}let a=updateAttributes(e.childNodes[o],t.props,d.props,l,e._dozAttach[COMPONENT_INSTANCE]||n,t.isSVG);if(l.$$beforeNodeWalk(e,o,a))return;const c=t.children.length,i=d.children.length;for(let a=0;a<c||a<i;a++)update(e.childNodes[o],t.children[a],d.children[a],a,l,r,e._dozAttach[COMPONENT_INSTANCE]||n);clearDead()}}else e.childNodes[o]&&deadChildren.push(e.childNodes[o])}}function getChildByKey(e,t){let d={};for(let o=0;o<t.length;o++)if(e===t[o].key){d=t[o];break}return d}function clearDead(){let e=deadChildren.length;for(;e--;)deadChildren[e].parentNode.removeChild(deadChildren[e]),deadChildren[e]._dozAttach&&deadChildren[e]._dozAttach[COMPONENT_INSTANCE]&&(deadChildren[e]._dozAttach[COMPONENT_INSTANCE].unmount(),deadChildren[e]._dozAttach[COMPONENT_INSTANCE].destroy()),deadChildren.splice(e,1)}export{create};export{update};export default{create:create,update:update};