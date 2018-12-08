const composeStyleInner = require('../utils/compose-style-inner');
const createStyle = require('../utils/create-style');

function scopedInner(cssContent, tag, tagByData) {
    if (typeof cssContent !== 'string') return;
    cssContent = composeStyleInner(cssContent, tag, tagByData);
    return createStyle(cssContent, tag);
}

module.exports = {
    scopedInner
};