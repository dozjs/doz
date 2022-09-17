const toInlineStyle = require('./toInlineStyle');

function composeStyle(style, tag) {
    let out = '';
    Object.keys(style).forEach(key => {
        if (/^@media/.test(key)) {
            out += `${key} {${composeStyle(style[key], tag)}}`
        } else {
            let properties = toInlineStyle(style[key], false);
            key = `${tag} ${key.replace(/(,)/g, `$1${tag} `)}`;
            out += `${key}{${properties}} `;
        }
    });
    return out;
}

module.exports = composeStyle;