const html = require('../utils/html');
const {scopedInner} = require('./style');
const {CMP_INSTANCE, ATTR, DIR_IS} = require('../constants');
const collection = require('../collection');
const hooks = require('./hooks');
const {serializeProps} = require('../vdom/parser');
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
    let cmpName;
    const trash = [];

    function walk(child, parent = {}) {
        while (child) {

            if (child.nodeName === 'STYLE') {
                const dataSetId = parent.cmp._rootElement.parentNode.dataset.is;
                let tagByData;
                if (dataSetId)
                    tagByData = `[data-is="${dataSetId}"]`;
                scopedInner(child.textContent, parent.cmp.tag, tagByData);
                const emptyStyle = document.createElement('script');
                emptyStyle.type = 'text/style';
                emptyStyle.textContent = ' ';
                emptyStyle.dataset.id = parent.cmp.tag + '--style';
                emptyStyle.dataset.owner = parent.cmp.tag;
                if (tagByData)
                    emptyStyle.dataset.ownerByData = tagByData;
                child.parentNode.replaceChild(emptyStyle, child);
                child = emptyStyle.nextSibling;
                continue;
            }

            if (typeof child.getAttribute === 'function' && child.hasAttribute(ATTR.IS)) {
                cmpName = child.getAttribute(ATTR.IS).toLowerCase();
                child.removeAttribute(ATTR.IS);
                child.dataset.is = cmpName;
                child[DIR_IS] = true;
            } else
                cmpName = child.nodeName.toLowerCase();

            let localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            const cmp = cfg.autoCmp ||
                localComponents[cmpName] ||
                cfg.app._components[cmpName] ||
                collection.getComponent(cmpName);

            if (cmp) {

                if (parent.cmp) {
                    const rawChild = child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                }

                // For node created by mount method
                if (parent.cmp && parent.cmp.mounted) {
                    child = child.nextSibling;
                    continue;
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push(child);
                    child = child.nextSibling;
                    continue;
                }

                const props = serializeProps(child);
                const dProps = extract(props);

                let newElement;

                if (typeof cmp.cfg === 'function') {
                    newElement = new cmp.cfg({
                        tag: cmpName,
                        root: child,
                        app: cfg.app,
                        props,
                        dProps,
                        parentCmp: parent.cmp || cfg.parent
                    });
                } else {
                    newElement = new Component({
                        tag: cmpName,
                        cmp,
                        root: child,
                        app: cfg.app,
                        props,
                        dProps,
                        parentCmp: parent.cmp || cfg.parent
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
                    newElement._isRendered = true;
                    newElement.render(true);

                    if (!component) {
                        component = newElement;
                    }

                    newElement._rootElement[CMP_INSTANCE] = newElement;

                    child.insertBefore(newElement._rootElement, child.firstChild);

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

            if (!cmp) {
                parentElement = parent.cmp;
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