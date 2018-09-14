const data = require('./data');

/**
 * Register a component to global
 * @param cmp
 */
function registerComponent(cmp) {

    const tag = cmp.tag.toUpperCase();

    if (Object.prototype.hasOwnProperty.call(data.components, tag))
        console.warn('Doz', `component ${tag} overwritten`);

    data.components[tag] = cmp;
}

/**
 * Remove all global components
 */
function removeAll() {
    data.components = {};
    data.plugins = [];
}

/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function getComponent(tag) {
    tag = tag.toUpperCase();
    return data.components[tag];
}

/**
 * Register a plugin to global
 * @param plugin
 */
function registerPlugin(plugin) {
    data.plugins.push(plugin);
}

module.exports = {
    registerComponent,
    registerPlugin,
    getComponent,
    removeAll,
    data
};