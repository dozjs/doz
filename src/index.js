const Doz = require('./Doz');
const collection = require('./collection');
const {use} = require('./plugin');
const component = require('./component');
const {Component} = require('./component/Component');
const mixin = require('./component/global-mixin');
const h = require('./vdom/h');
const {compile} = require('./vdom/parser');
const {update} = require('./vdom/element');

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
    version: {
        value: '[AIV]{version}[/AIV]',
        enumerable: true
    }
});

module.exports = Doz;