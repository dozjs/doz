const extend = require('defaulty');
const collection = require('./collection');
const {createInstance} = require('./component');
const html = require('./html');

function componentInstances(element) {
    const nodes = html.getAllNodes(element);
    const components = [];

    nodes.forEach(child => {
        if (child.nodeType === 1) {
            const cmp = collection.get(child.nodeName);
            if (cmp) {
                const newChild = createInstance(cmp, {
                    props: child.attributes
                });
                child.parentNode.replaceChild(newChild, child);
                components.push(newChild);
            }
        }
    });

    return components;
}

class Doz {
    constructor(cfg = {}) {

        if (typeof cfg.el !== 'string') {
            throw new TypeError('el must be a string selector and is required');
        }

        this.cfg = extend.copy(cfg, {});

        this.dom = document.querySelector(this.cfg.el);
        this.components = componentInstances(this.dom);

    }

}

module.exports = Doz;