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
    const METHOD = 'onSystemAppInit';
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

function callMethodNoDirective(...args) {
    let method = args.shift();
    Object.keys(data.directives).forEach(key => {
        if (data.directives[key] !== undefined && typeof data.directives[key][method] === 'function') {
            data.directives[key][method].apply(data.directives[key], args)
        }
    });
}

function callComponentCreate(...args) {
    args = ['onComponentCreate', ...args];
    callMethod.apply(null, args)
}

// All methods that starts with prefix callSystem are considered extra of directives hooks
// because they don't use any prop but are useful for initializing stuff

function callSystemComponentCreate(...args) {
    args = ['onSystemComponentCreate', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentSetConfig(...args) {
    args = ['onSystemComponentSetConfig', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentSetProps(...args) {
    args = ['onSystemComponentSetProps', ...args];
    callMethodNoDirective.apply(null, args);
}

function callSystemComponentLoadProps(...args) {
    args = ['onSystemComponentLoadProps', ...args];
    callMethodNoDirective.apply(null, args);
}

module.exports = {
    directive,
    callMethod,
    load,
    callComponentCreate,
    callSystemComponentCreate,
    callSystemComponentLoadProps,
    callSystemComponentSetConfig,
    callSystemComponentSetProps
};