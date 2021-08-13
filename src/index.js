const Doz = require('./Doz');
const collection = require('./collection');
const {use} = require('./plugin');
const {directive} = require('./directives');
const component = require('./component');
const Component = require('./component/Component');
const mixin = require('./component/helpers/global-mixin');
const h = require('./vdom/h');
const mount = require('./mount');
const {compile} = require('./vdom/parser');
//const mapper = require('./vdom/mapper');
const {update} = require('./vdom/element');
const tag = require('./decorators/tag');
const {createDozWebComponent, defineWebComponent, defineWebComponentFromGlobal} = require('./webComponent');
require('./directives/built-in/bootstrap');

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
    version: {
        value: '[AIV]{version}[/AIV]',
        enumerable: true
    },
    tag: {
        value: tag,
        enumerable: true
    },
    createDozWebComponent: {
        value: createDozWebComponent,
        enumerable: true
    },
    defineWebComponent: {
        value: defineWebComponent,
        enumerable: true
    },
    defineWebComponentFromGlobal: {
        value: defineWebComponentFromGlobal,
        enumerable: true
    },
    mount : {
        value: mount,
        enumerable: true
    }
});

module.exports = Doz;
module.exports.collection = collection;
module.exports.compile = compile;
module.exports.Component = Component;
module.exports.component = component;
module.exports.define = component;
module.exports.h = h;
module.exports.update = update;
module.exports.mixin = mixin;
module.exports.use = use;
module.exports.directive = directive;
module.exports.version = Doz.version;
module.exports.tag = tag;
module.exports.createDozWebComponent = createDozWebComponent;
module.exports.defineWebComponent = defineWebComponent;
module.exports.defineWebComponentFromGlobal = defineWebComponentFromGlobal;