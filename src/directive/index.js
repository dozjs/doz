const {registerDirective, data} = require('../collection');
const {REGEX} = require('../constants.js');

function extractDirectivesFromProps(props) {
    let directives = {};
    Object.keys(props).forEach(key => {
        if (REGEX.IS_DIRECTIVE.test(key)) {
            let keyWithoutD = key.replace(/^d-/, '');
            directives[keyWithoutD] = props[key];
        }
    });
    return directives;
}

function directive(name, options = {}) {
    registerDirective(name, options);
}

function callDirective(method, cmp, ...args) {
    let directivesKeyValue = extractDirectivesFromProps(cmp.props);
    Object.keys(directivesKeyValue).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            args.unshift(directivesKeyValue[key]);
            data.directives[key][method].apply(cmp, args)
        }
    });
}

module.exports = {
    directive,
    callDirective
};