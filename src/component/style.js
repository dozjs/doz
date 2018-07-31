const toInlineStyle = require('../utils/to-inline-style');

function scoped(instance) {
    if (typeof instance.style !== 'object') return;

    function composeStyle(style) {
        let out = '';
        Object.keys(style).forEach(key => {
            if (/^@media/.test(key)) {
                out += `${key} {${composeStyle(style[key])}}`
            } else {
                let properties = toInlineStyle(style[key], false);
                key = `${tag} ${key.replace(/(,)/g, `$1${tag} `)}`;
                out += `${key}{${properties}} `;
            }
        });
        return out;
    }

    const tag = instance.tag;
    const styleId = `${instance.tag}--style`;

    if (document.querySelector(`#${styleId}`)) return;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = composeStyle(instance.style);

    document.head.appendChild(styleEl);
}

module.exports = {
    scoped
};