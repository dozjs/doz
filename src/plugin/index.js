const {registerPlugin, data} = require('../collection');
// Add props-propagation plugin
use(require('./built-in/props-propagation'));

function use(plugin, options = {}) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }

    plugin['options'] = options;

    registerPlugin(plugin);
}

function load(app) {
    //console.log(data.plugins)
    data.plugins.forEach(func => {
        func(app.constructor, app, func.options);
    })
}

module.exports = {
    use,
    load
};