const composeStyleInner = require('../../utils/composeStyleInner');
const createStyle = require('../../utils/createStyle');

function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string') return;

    cssContent = composeStyleInner(cssContent, tag, cmp);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}

module.exports = {
    scopedInner
};