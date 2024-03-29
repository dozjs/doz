import data from "./data.js";
/**
 * Register a component to global
 * @param cmp
 */
function registerComponent(cmp) {
    const tag = cmp.tag.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(data.components, tag))
        console.warn('Doz', `component ${tag} overwritten`);
    data.components[tag] = cmp;
}
/**
 * Remove all global components
 */
function removeAll() {
    data.components = {};
    //data.plugins = [];
    //data.directives = {};
}
/**
 * Get component from global
 * @param tag
 * @returns {*}
 */
function getComponent(tag) {
    tag = tag.toUpperCase();
    return data.components[tag];
}
/**
 * Register a plugin to global
 * @param plugin
 */
function registerPlugin(plugin) {
    data.plugins.push(plugin);
}
/**
 * Register a directive to global
 * @param name
 * @param cfg
 */
function registerDirective(name, cfg = {}) {
    //console.log('directive', name)
    if (typeof name !== 'string') {
        throw new TypeError('Doz directive name must be a string');
    }
    if (typeof cfg !== 'object' || !cfg) {
        throw new TypeError('Doz directive config must be an object');
    }
    if (name[0] === ':') {
        cfg._onlyDozComponent = true;
        name = name.substring(1);
    }
    name = name.toLowerCase();
    let namePart = [];
    if (name.indexOf('-') !== -1) {
        namePart = name.split('-');
        name = namePart[0];
        namePart.shift();
    }
    cfg.name = name;
    cfg._keyArguments = namePart.map(item => item.substring(1)); // remove $
    if (Object.prototype.hasOwnProperty.call(data.directives, name))
        console.warn('Doz', `directive ${name} overwritten`);
    data.directives[name] = cfg;
    if (!data.directivesKeys.includes(name))
        data.directivesKeys.push(name);

    for (let m in cfg) {
        if (typeof cfg[m] === 'function' && m[0] === 'o' && m[1] === 'n' && m[2] === 'A' && m[3] === 'p' && m[4] === 'p') {
            cfg[m].___this___ = cfg;
            if (!data.directivesMethodsMap[m]) {
                data.directivesMethodsMap[m] = [cfg[m]]
            } else {
                data.directivesMethodsMap[m].push(cfg[m])
            }
        }
    }
    //console.log(data.directivesMethodsMap)
}
export { registerComponent };
export { registerPlugin };
export { getComponent };
export { registerDirective };
export { removeAll };
export { data };
export default {
    registerComponent,
    registerPlugin,
    getComponent,
    registerDirective,
    removeAll,
    data
};
