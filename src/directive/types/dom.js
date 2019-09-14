const {REGEX} = require('../../constants.js');
const {data} = require('../../collection');

function callMethod(...args) {
    let method = args[0];
    let cmp = args[1];

    // Remove first argument event name
    args.shift();
}

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
function callDOMAttributeSet(instance, $target, attributeName, attributeValue, callback) {
    let method = 'onDOMAttributeSet';
    if (REGEX.IS_DIRECTIVE.test(attributeName)) {
        let directiveName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
        let directiveObj = data.directives[directiveName];
        if (directiveObj && directiveObj[method]) {
            $target.removeAttribute(attributeName);
            let ret = directiveObj[method].apply(directiveObj, [instance, $target, attributeName, attributeValue]);
            if (ret !== undefined && typeof callback === 'function') {
                callback(ret);
            }
        }
    }
}

function callDOMElementCreate(instance, $target, initial) {
    let method = 'onDOMElementCreate';
    let attributes = Array.from($target.attributes);
    attributes.forEach(attribute => {
        if (REGEX.IS_DIRECTIVE.test(attribute.name)) {
            let directiveName = attribute.name.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            let directiveValue = attribute.value;
            let directiveObj = data.directives[directiveName];
            if (directiveObj && directiveObj[method]) {
                $target.removeAttribute(attribute.name);
                directiveObj[method].apply(directiveObj, [instance, $target, directiveValue, initial])
            }
        }
    });
}

module.exports = {
    callDOMAttributeCreate,
    callDOMAttributeSet,
    callDOMElementCreate
};