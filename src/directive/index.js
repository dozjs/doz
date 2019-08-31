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
    const METHOD = 'onAppInit';
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][METHOD] === 'function') {
            data.directives[key][METHOD].call(data.directives[key], app)
        }
    });
}

function callMethod(...args) {
    let method = args[0];
    let cmp = args[1];
    let directivesKeyValue = extractDirectivesFromProps(cmp.props);
    Object.keys(directivesKeyValue).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            args.unshift(directivesKeyValue[key]);
            args.unshift(cmp);
            data.directives[key][method].apply(data.directives[key], args)
        }
    });
}

function callComponentCreate(...args) {
    args = ['onComponentCreate', ...args];
    callMethod.apply(null, args)
}

function callComponentLoadProps(...args) {
    args = ['onLoadProps', ...args];
    callMethod.apply(null, args)
}

function callComponentCreateWithoutProps(instance) {
    const METHOD = 'onComponentCreateWithoutProps';
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][METHOD] === 'function') {
            data.directives[key][METHOD].call(data.directives[key], instance)
        }
    });
}

function callComponentSetConfig(instance, obj) {
    const METHOD = 'onComponentSetConfig';
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][METHOD] === 'function') {
            data.directives[key][METHOD].call(data.directives[key], instance, obj)
        }
    });
}

function callComponentSetProps(instance) {
    const METHOD = 'onComponentSetProps';
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][METHOD] === 'function') {
            data.directives[key][METHOD].call(data.directives[key], instance)
        }
    });
}

module.exports = {
    directive,
    callMethod,
    load,
    callComponentCreate,
    callComponentCreateWithoutProps,
    callComponentLoadProps,
    callComponentSetConfig,
    callComponentSetProps
};