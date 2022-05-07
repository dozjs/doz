import camelToDash from "./camelToDash.js";
function toInlineStyle(obj, withStyle = true) {
    obj = Object.entries(obj).reduce((styleString, [propName, propValue]) => {
        return `${styleString}${camelToDash(propName)}:${propValue};`;
    }, '');
    return withStyle ? `style="${obj}"` : obj;
}
export default toInlineStyle;
