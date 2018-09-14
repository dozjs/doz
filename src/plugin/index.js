const {registerPlugin, data} = require('../collection');

function use(plugin, options = {}) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }

    plugin['options'] = options;

    registerPlugin(plugin);
}

function load(app) {
    data.plugins.forEach(func => {
        func(app.constructor, app, func.options);
    })
}

module.exports = {
    use,
    load
};