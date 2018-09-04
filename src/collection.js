const data = require('./data');

/**
 * Register a component to global
 * @param cmp
 */
function register(cmp) {

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
}

/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function get(tag) {
    tag = tag.toUpperCase();
    return data.components[tag];
}

module.exports = {
    register,
    get,
    removeAll,
    data
};