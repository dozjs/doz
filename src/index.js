const Doz = require('./Doz');
const collection = require('./collection');
const component = require('./component');
const {use} = require('./plugin');
const {Component} = require('./component/Component');
const h = require('./vdom/h');
const mixin = require('./component/global-mixin');
const compile = require('./component/compile');

/**
 * @property {Object}
 * @name collection
 */

/**
 * @property {Function}
 * @name compile
 */

/**
 * @property {Component}
 * @name Component
 */

/**
 * @property {Function}
 * @name component
 */

/**
 * @property {Function}
 * @name define
 */

/**
 * @property {Function}
 * @name h
 */

/**
 * @property {Function}
 * @name mixin
 */

/**
 * @property {Function}
 * @name use
 */

/**
 * @property {String}
 * @name version
 */

Object.defineProperties(Doz, {
    collection: {
        value: collection,
        enumerable: true
    },
    compile: {
        value: compile,
        enumerable: true
    },
    Component: {
        value: Component,
        enumerable: true
    },
    component: {
        value: component,
        enumerable: true
    },
    define: {
        value: component,
        enumerable: true
    },
    h: {
        value: h,
        enumerable: true
    },
    mixin: {
        value: mixin,
        enumerable: true
    },
    use: {
        value: use,
        enumerable: true
    },
    version: {
        value: '[AIV]{version}[/AIV]',
        enumerable: true
    }
});

module.exports = Doz;