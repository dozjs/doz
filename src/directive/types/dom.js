const {REGEX} = require('../../constants.js');
const {data} = require('../../collection');

// Hooks for DOM element

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
    callDOMElementCreate
};