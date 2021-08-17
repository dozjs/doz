import Doz from "./Doz.js";
import collection from "./collection.js";
import { use } from "./plugin/index.js";
import directives from "./directives/index.js";
import component from "./component/index.js";
import Component from "./component/Component.js";
import mixin from "./component/helpers/global-mixin.js";
import h from "./vdom/h.js";
import mount from "./mount.js";
import { compile } from "./vdom/parser.js";
import { update } from "./vdom/element.js";
import tag from "./decorators/tag.js";
import { createDozWebComponent, defineWebComponent, defineWebComponentFromGlobal } from "./webComponent.js";
import "./directives/built-in/bootstrap.js";
const { directive } = directives;
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
    mount: {
        value: mount,
        enumerable: true
    }
});
export const version = Doz.version;
export default Doz;
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
