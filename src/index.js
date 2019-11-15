const Doz = require('./Doz');
const collection = require('./collection');
const {use} = require('./plugin');
const {directive} = require('./directive');
const component = require('./component');
const Component = require('./component/Component');
const mixin = require('./component/helpers/global-mixin');
const h = require('./vdom/h');
const {compile} = require('./vdom/parser');
const mapCompiled = require('./vdom/map-compiled');
const {update} = require('./vdom/element');
const tag = require('./decorator/tag');
require('./directive/built-in/_bootstrap');

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
    update: {
        value: update,
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
    directive: {
        value: directive,
        enumerable: true
    },
    mapCompiled: {
        value: mapCompiled
    },
    version: {
        value: '[AIV]{version}[/AIV]',
        enumerable: true
    },
    tag: {
        value: tag,
        enumerable: true
    }
});

module.exports = Doz;