import { registerPlugin, data } from "../collection.js";
import propsPropagation from "./built-in/props-propagation.js";
// Add props-propagation plugin
use(propsPropagation);
function use(plugin, options = {}) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin must be a function');
    }
    plugin['options'] = options;
    registerPlugin(plugin);
}
function load(app) {
    //console.log(data.plugins)
    data.plugins.forEach(func => {
        func(app.constructor, app, func.options);
    });
}
export { use };
export { load };
export default {
    use,
    load
};
