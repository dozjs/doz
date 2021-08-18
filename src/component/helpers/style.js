const composeStyleInner = require('../../utils/compose-style-inner');
const createStyle = require('../../utils/create-style');

function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string') return;

    cssContent = composeStyleInner(cssContent, tag, cmp);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}

module.exports = {
    scopedInner
};