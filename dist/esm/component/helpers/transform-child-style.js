import{scopedInner}from"./style.js";function transformChildStyle(t,e){if("STYLE"!==t.nodeName)return;const a=e.cmp.uId;e.cmp._rootElement.parentNode.dataset.uid=e.cmp.uId;let o=`[data-uid="${a}"]`,n=t.hasAttribute("data-scoped");scopedInner(t.textContent,a,o,n);const d=document.createElement("script");return d.type="text/style",d.textContent=" ",d._dozAttach={styleData:{}},d._dozAttach.styleData.id=a+"--style",d._dozAttach.styleData.owner=a,d._dozAttach.styleData.ownerByData=o,n&&(d._dozAttach.styleData.scoped="true"),t.parentNode.replaceChild(d,t),t=d.nextSibling}export default transformChildStyle;