const html = require('../utils/html');
const {CMP_INSTANCE} = require('../constants');
const collection = require('../collection');
const hooks = require('./hooks');
const { serializeProps} = require('../vdom/parser');
const {extract} = require('./d-props');
const hmr = require('./hmr');
const {Component} = require('./Component');

function get(cfg = {}) {

    if (!cfg.root) return;

    cfg.template = typeof cfg.template === 'string'
        ? html.create(cfg.template)
        : cfg.template;

    cfg.root.appendChild(cfg.template);

    let component = null;
    let parentElement;
    const trash = [];

    function walk(child, parent = {}) {
        while (child) {

            const cmpName = child.nodeName.toLowerCase();
            let localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            const cmp = cfg.autoCmp ||
                localComponents[cmpName] ||
                cfg.app._components[cmpName] ||
                collection.get(child.nodeName);

            if (cmp) {

                if (parent.cmp) {
                    const rawChild = child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push(child);
                    child = child.nextSibling;
                    continue;
                }

                const props = serializeProps(child);
                const dProps = extract(props);

                let newElement;

                //console.log(cmp);

                if (typeof cmp.cfg === 'function') {
                    newElement = new cmp.cfg({
                        tag: cmpName,
                        root: child,
                        app: cfg.app,
                        props,
                        dProps,
                        parentCmp: parent.cmp
                    });
                } else {
                    newElement = new Component({
                        tag: cmpName,
                        cmp,
                        root: child,
                        app: cfg.app,
                        props,
                        dProps,
                        parentCmp: parent.cmp
                    });
                }

                if (!newElement) {
                    child = child.nextSibling;
                    continue;
                }

                if (typeof newElement.module === 'object') {
                    hmr(newElement, newElement.module);
                }

                if (hooks.callBeforeMount(newElement) !== false) {
                    newElement.render(true);

                    if (!component) {
                        component = newElement;
                    }

                    newElement._rootElement[CMP_INSTANCE] = newElement;

                    child.insertBefore(newElement._rootElement, child.firstChild);

                    hooks.callRender(newElement);
                    hooks.callMount(newElement);
                    hooks.callMountAsync(newElement);
                }

                parentElement = newElement;

                if (parent.cmp) {
                    let n = Object.keys(parent.cmp.children).length;
                    parent.cmp.children[newElement.alias ? newElement.alias : n++] = newElement;
                }

                cfg.autoCmp = null;
            }

            if (child.hasChildNodes()) {
                walk(child.firstChild, {cmp: parentElement})
            }

            child = child.nextSibling;
        }
    }

    walk(cfg.template);

    trash.forEach(child => child.remove());

    return component;
}

module.exports = {
    get
};