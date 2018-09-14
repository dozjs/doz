const {registerPlugin, data} = require('../collection');

function use(plugin) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }
    registerPlugin(plugin);
}

function load(app) {
    data.plugins.forEach(func => {
        func(app.constructor, app);
    })
}

module.exports = {
    use,
    load
};