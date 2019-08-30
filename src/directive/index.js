const {registerDirective, data} = require('../collection');
const {REGEX} = require('../constants.js');

function extractDirectivesFromProps(props) {
    let directives = {};
    Object.keys(props).forEach(key => {
        if (REGEX.IS_DIRECTIVE.test(key)) {
            let keyWithoutD = key.replace(/^d[-:]/, '');
            directives[keyWithoutD] = props[key];
        }
    });
    return directives;
}

function directive(name, options = {}) {
    registerDirective(name, options);
}

function load(app) {
    const ON_INIT = 'onInit';
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][ON_INIT] === 'function') {
            data.directives[key][ON_INIT].call(null, app)
        }
    });
}

function call(method, cmp, ...args) {
    let directivesKeyValue = extractDirectivesFromProps(cmp.props);
    Object.keys(directivesKeyValue).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            args.unshift(directivesKeyValue[key]);
            args.unshift(cmp);
            data.directives[key][method].apply(null, args)
        }
    });
}

module.exports = {
    directive,
    call,
    load
};