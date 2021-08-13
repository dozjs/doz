import { scopedInner } from "./style.js";
function transformChildStyle(child, parent) {
    if (child.nodeName !== 'STYLE')
        return;
    const dataSetUId = parent.cmp.uId;
    parent.cmp._rootElement.parentNode.dataset.uid = parent.cmp.uId;
    //child.removeAttribute('scoped');
    let tagByData = `[data-uid="${dataSetUId}"]`;
    let isScoped = child.hasAttribute('data-scoped');
    scopedInner(child.textContent, dataSetUId, tagByData, isScoped);
    const emptyStyle = document.createElement('script');
    emptyStyle.type = 'text/style';
    emptyStyle.textContent = ' ';
    emptyStyle._dozAttach = {
        styleData: {}
    };
    emptyStyle._dozAttach.styleData.id = dataSetUId + '--style';
    emptyStyle._dozAttach.styleData.owner = dataSetUId;
    emptyStyle._dozAttach.styleData.ownerByData = tagByData;
    if (isScoped) {
        emptyStyle._dozAttach.styleData.scoped = 'true';
    }
    //console.log(emptyStyle);
    child.parentNode.replaceChild(emptyStyle, child);
    child = emptyStyle.nextSibling;
    return child;
}
export default transformChildStyle;
