const extend = require('defaulty');
const collection = require('./collection');
const html = require('./html');

function createComponentInstances(element) {
    const nodes = element.getElementsByTagName('*');
    for (let i = nodes.length - 1; i >= 0; i--) {
        let node = nodes[i];
        if (node.nodeType === 1) {
            const cmp = collection.get(node.nodeName);
            if (cmp) {
                const newNode = html.create(cmp.cfg.tpl);
                node.parentNode.replaceChild(newNode, node);
            }
        }

    }
}

class Doz {
    constructor(cfg = {}) {

        if (typeof cfg.el !== 'string') {
            throw new TypeError('el must be a string selector and is required');
        }

        this.cfg = extend.copy(cfg, {

        });

        this.dom = document.querySelector(this.cfg.el);

        createComponentInstances(this.dom);

    }

}

module.exports = Doz;