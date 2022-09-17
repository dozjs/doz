const camelToDash = require('./camelToDash');

function toInlineStyle(obj, withStyle = true) {
    obj = Object.entries(obj).reduce((styleString, [propName, propValue]) => {
        return `${styleString}${camelToDash(propName)}:${propValue};`;
    }, '');
    return withStyle ? `style="${obj}"` : obj;
}

module.exports = toInlineStyle;