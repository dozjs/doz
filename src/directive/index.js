const {registerDirective, data} = require('../collection');
const {REGEX} = require('../constants.js');

function extractDirectivesFromProps(props, deleteProps) {
    let directives = {};
    Object.keys(props).forEach(key => {
        if (REGEX.IS_DIRECTIVE.test(key)) {
            let keyWithoutD = key.replace(/^d[-:]/, '');
            directives[keyWithoutD] = props[key];
            if (deleteProps)
                delete props[key];
        }
    });
    return directives;
}

function directive(name, options = {}) {
    registerDirective(name, options);
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
// because they don't use any prop but are useful for initializing stuff.
// For example built-in like d:store and d:id

function callSystemAppInit(...args) {
    args = ['onSystemAppInit', ...args];
    callMethodNoDirective.apply(null, args);
}

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
    extractDirectivesFromProps,
    callComponentCreate,
    callSystemAppInit,
    callSystemComponentCreate,
    callSystemComponentLoadProps,
    callSystemComponentSetConfig,
    callSystemComponentSetProps
};