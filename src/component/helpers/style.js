const composeStyleInner = require('../../utils/compose-style-inner');
const createStyle = require('../../utils/create-style');

function scopedInner(cssContent, uId, tag, scoped) {
    if (typeof cssContent !== 'string') return;
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, uId, tag, scoped);
}

module.exports = {
    scopedInner
};