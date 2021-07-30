import { registerDirective } from "../collection.js";
import app from "./types/app.js";
import component from "./types/component.js";
function directive(name, options = {}) {
    registerDirective(name, options);
}
export default Object.assign({
    directive
}, app, component);
