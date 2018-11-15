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
    let usedRoot = false;

    const rules = cssContent.split('}');

    for (let i = 0; i < rules.length; i++) {
        usedRoot = false;
        rules[i] = rules[i].replace(REGEX.CSS_SELECTOR, (match, p1) => {
            if (/^:root/.test(p1)) {
                usedRoot = true;
                return `${tag} ${p1[p1.length - 1]}`;
            } else {
                if (usedRoot) {
                    return `${p1}`
                }
                return `${tag} ${p1}`
            }
        });
    }

    cssContent = rules.join('}');

    return createStyle(cssContent, tag);
}

module.exports = {
    scoped,
    scopedInner,
    createStyle
};