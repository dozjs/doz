const composeStyle = require('../utils/compose-style');
const composeStyleInner = require('../utils/compose-style-inner');
const createStyle = require('../utils/create-style');

function scoped(instance) {
    if (typeof instance.style !== 'object') return;
    const cssContent = composeStyle(instance.style, instance.tag);
    return createStyle(cssContent, instance.tag);
}

function scopedInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, tag);
}

module.exports = {
    scoped,
    scopedInner
};