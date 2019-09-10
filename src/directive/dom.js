const {REGEX} = require('../constants.js');
const {data} = require('../collection');

// Hooks for DOM element
function callDOMAttributeCreate(instance, $target, attributeName, attributeValue, nodeProps) {
    let method = 'onDOMAttributeCreate';
    if (REGEX.IS_DIRECTIVE.test(attributeName)) {
        let directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
        let directiveObj = data.directives[directiveName];
        if (directiveObj && directiveObj[method]) {
            $target.removeAttribute(attributeName);
            directiveObj[method].apply(directiveObj, [instance, $target, attributeName, attributeValue, nodeProps])
        }
    }
}

function callDOMElementCreate(...args) {
    //args = ['onSystemDOMElementCreate', ...args];
    //callMethodNoDirective.apply(null, args);
}

module.exports = {
    callDOMAttributeCreate,
    callDOMElementCreate
};