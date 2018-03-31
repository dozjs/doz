const {PARSER} = require('../constants');

function sanitize(field) {
    //console.log('field', field);
    return field.replace(/[ "=]/g, '');
}

function transformTag(el, regex) {
    el.innerHTML = el.innerHTML.replace(regex, function replacer(match) {
        // Remove spaces
        match = sanitize(match);
        return `<${PARSER.TAG.TEXT} value=${match}></${PARSER.TAG.TEXT}>`;
    });
}

function replaceComponent(textNodes) {
    textNodes.forEach(item => {
        item.old.parentNode.replaceChild(item.new, item.old)
    });
}

function createProp(name, props, component) {
    name.split('.').reduce((o, i, y, m) => {
        const isLast = m[m.length - 1] === i;
        if (isLast) {
            if (o.hasOwnProperty(i)) {
                if (!o[i].length)
                    o[i] = [component];
                else {
                    if (!Array.isArray(o[i]))
                        o[i] = [o[i]];
                    o[i].push(component)
                }
            } else {
                o[i] = component;
            }
        } else if (!o.hasOwnProperty(i)) {
            o[i] = [];
        }

        return o[i]

    }, props);
}

module.exports = {
    createProp,
    sanitize,
    transformTag,
    replaceComponent
};