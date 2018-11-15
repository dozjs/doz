const composeStyle = require('../utils/compose-style');
const {REGEX} = require('../constants');

function createStyle(cssContent, tag) {
    let result;
    const styleId = `${tag}--style`;
    const styleExists = document.querySelector(`#${styleId}`);

    if (styleExists) {
        result = styleExists.innerHTML = cssContent;
    } else {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        document.head.appendChild(styleEl);
    }

    return result;
}

function scoped(instance) {
    if (typeof instance.style !== 'object') return;
    const cssContent = composeStyle(instance.style, instance.tag);
    return createStyle(cssContent, instance.tag);
}

function scopedInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;
    cssContent = cssContent
        .replace(REGEX.CSS_SELECTOR, `${tag} $1`)
        .replace(/:root(?:\s+)?{/g, `{`);
    return createStyle(cssContent, tag);
}

module.exports = {
    scoped,
    scopedInner,
    createStyle
};