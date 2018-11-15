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

function _scopedInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;
    let usedRoot = false;

    const rules = cssContent.split('}');

    for (let i = 0; i < rules.length; i++) {
        usedRoot = false;
        if (/^@/.test(rules[i]))
            continue;
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

function scopedInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;
    let usedRoot = false;

    //const rules = cssContent.split('}');

    //console.log(rules)

    //for (let i = 0; i < rules.length; i++) {
    //usedRoot = false;
    /*if (/^@/.test(rules[i]))
        continue;*/
    //rules[i] = rules[i].replace(/{/g, '{\n').replace(/[^\s].*{/gm, match => {
    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/,/g, ' , ')
        .replace(/>/g, ' > ')
        .replace(/:root/g, tag)
        .replace(/[^\s].*{/gm, match => {

            if (/^(@|(from|to)[^-_])/.test(match))
                return match;

            let part = match.split(' ');
            let lastSymbol = '';

            for (let i = 0; i < part.length; i++) {
                if (part[i] === tag) continue;
                if(/[\w-_#.]/.test(part[i])) {
                    //console.log(part[i], 'name');
                    part[i] = `${tag} ${part[i]}`
                } else if(part[i] && part[i] !== '{' && part[i] !== '}') {
                    lastSymbol = part[i];
                }
            }

            match = part.join(' ');
            match = match
                .replace(/\s{2,}/g, ' ');

            return match
            /*if (/^:root/.test(p1)) {
                usedRoot = true;
                return `${tag} ${p1[p1.length - 1]}`;
            } else {
                if (usedRoot) {
                    return `${p1}`
                }
                return `${tag} ${p1}`
            }*/
        });
    //}

    //cssContent = rules.join('}');

    return createStyle(cssContent, tag);
}

module.exports = {
    scoped,
    scopedInner,
    createStyle
};