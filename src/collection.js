const {ROOT} = require('./constants');

/**
 * Get or create global collection
 * @returns {{}|components|{InjectAsComment: boolean, InjectByTag: boolean}|{InjectAsComment, InjectByTag}|Array|*}
 */
function getOrCreate() {
    window[ROOT] = window[ROOT] || {components: {}};
    return window[ROOT].components;
}

/**
 * Register a component to global
 * @param cmp
 */
function register(cmp) {
    const collection = getOrCreate();

    const tag = cmp.tag.toUpperCase();

    if (!collection.hasOwnProperty(tag)) {
        collection[tag] = cmp;
    } else {
        throw new Error(`Component ${tag} already defined`);
    }
}

function removeAll() {
    if (window[ROOT])
        window[ROOT].components = {};
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
    removeAll
};