const camelToDash = require('./camel-to-dash');

function toInlineStyle(obj) {
    obj = Object.entries(obj).reduce((styleString, [propName, propValue]) => {
        return `${styleString}${camelToDash(propName)}:${propValue};`;
    }, '');
    return `style="${obj}"`
}

module.exports = toInlineStyle;