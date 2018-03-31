const extend = require('defaulty');
const {register} = require('./collection');
const html = require('./html');
const {INSTANCE, PARSER} = require('./constants');

function Component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        data: {},
        tpl: '<div></div>'
    });

    register(cmp);
}

function createInstance(cmp, cfg) {
    const element = html.create(cmp.cfg.tpl);
    const nodes = html.getAllNodes(element);
    const props = {};

    Array.from(cfg.props).forEach(prop => {
        props[prop.name] = prop.value;
    });

    // Now need to mapping all placeholder in html and convert them in node
    nodes.forEach(child => {
        if (child.nodeType === 1) {
            Array.from(child.attributes).forEach(attr => {
                if (attr.nodeType === 1) {

                }
            })
        }
    });

    console.log(props);

    element[INSTANCE] = {};
    return element;
}

module.exports = Component;
module.exports.createInstance = createInstance;