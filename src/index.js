const Doz = require('./Doz');
const collection = require('./collection');
const component = require('./component');
const Component = require('./component/Component').Component;
const h = require('./vdom/h');
const mixin = require('./component/global-mixin');

Object.defineProperties(Doz, {
    collection: {
        value: collection,
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
    version: {
        value: '[AIV]{version}[/AIV]',
        enumerable: true
    }
});

module.exports = Doz;