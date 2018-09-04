const data = require('./data');

/**
 * Get or create global collection
 * @returns {{}|components|{InjectAsComment: boolean, InjectByTag: boolean}|{InjectAsComment, InjectByTag}|Array|*}
 */
function getOrCreate() {
    return data.components;
}

/**
 * Register a component to global
 * @param cmp
 */
function register(cmp) {
    const collection = getOrCreate();

    const tag = cmp.tag.toUpperCase();

    if (Object.prototype.hasOwnProperty.call(collection, tag))
        console.warn('Doz', `component ${tag} overwritten`);

    collection[tag] = cmp;
}

function removeAll() {
    data.components = {};
}

/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function get(tag) {
    if (typeof tag !== 'string')
        throw new TypeError('tag must be a string');

    tag = tag.toUpperCase();

    const collection = getOrCreate();
    return collection[tag];
}

module.exports = {
    register,
    get,
    removeAll,
    data
};