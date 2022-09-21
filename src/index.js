import Doz from "./Doz.js";
import collection from "./collection.js";
import { use } from "./plugin/index.js";
import directives from "./directives/index.js";
import component from "./component/index.js";
import Component from "./component/Component.js";
import mixin from "./component/helpers/globalMixin.js";
import h from "./vdom/h.js";
import appCreate from "./appCreate.js";
import { compile } from "./vdom/parser.js";
import { update } from "./vdom/element.js";
import tag from "./decorators/tag.js";
import createInstance from "./component/createInstance.js";
import { createDozWebComponent, defineWebComponent, defineWebComponentFromGlobal } from "./webComponent.js";
import bootstrap from "./directives/builtIn/bootstrap.js";
const { directive } = directives;
bootstrap();
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
        value: '[VI]{version}[/VI]',
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
    appCreate: {
        value: appCreate,
        enumerable: true
    },
    createInstance: {
        value: createInstance,
        enumerable: true
    }
});
export const version = Doz.version;
export default Doz;
export { appCreate };
export { collection };
export { compile };
export { Component };
export { component };
export { component as define };
export { h };
export { update };
export { mixin };
export { use };
export { directive };
export { tag };
export { createDozWebComponent };
export { defineWebComponent };
export { defineWebComponentFromGlobal };
export { createInstance };
