const {scopedInner} = require('./style');

function transformChildStyle(child, parent) {
    if (child.nodeName !== 'STYLE')
        return;

    const dataSetUId = parent.cmp.uId;
    parent.cmp._rootElement.parentNode.dataset.uid = parent.cmp.uId;
    //child.removeAttribute('scoped');
    let tagByData = `[data-uid="${dataSetUId}"]`;
    let isScoped = child.hasAttribute('scoped');

    scopedInner(child.textContent, dataSetUId, tagByData, isScoped);

    const emptyStyle = document.createElement('script');
    emptyStyle.type = 'text/style';
    emptyStyle.textContent = ' ';
    emptyStyle.dataset.id = dataSetUId + '--style';
    emptyStyle.dataset.owner = dataSetUId;
    emptyStyle.dataset.ownerByData = tagByData;

    if(isScoped) {
        emptyStyle.dataset.scoped = 'true';
    }
    //console.log(emptyStyle);

    child.parentNode.replaceChild(emptyStyle, child);
    child = emptyStyle.nextSibling;

    return child;
}

module.exports = transformChildStyle;