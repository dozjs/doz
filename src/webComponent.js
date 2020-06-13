const Doz = require('./Doz');
const data = require('./data');
const dashToCamel = require('./utils/dash-to-camel');
require('./utils/create-style-soft-entrance')();

function createDozWebComponent(tag, cmp, observedAttributes = [], prefix = 'dwc', globalTag) {

    data.webComponents.tags[tag] = data.webComponents.tags[tag] || {};

    if (prefix) {
        prefix += '-';
    }

    customElements.define(prefix + tag, class extends HTMLElement {
        static get observedAttributes() {
            return observedAttributes;
        }

        constructor() {
            super();
        }

        connectedCallback() {
            let initialProps = {};
            let id = null;
            let contentHTML = '';
            let hasDataNoShadow = this.hasAttribute('data-no-shadow');
            let root = !hasDataNoShadow ? this.attachShadow({mode: 'open'}) : this;

            let thisElement = this;
            for (let att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                att = atts[i];
                if (att.nodeName === 'data-id') {
                    id = att.nodeValue;
                    continue;
                }

                if (observedAttributes.includes(att.nodeName)) {
                    initialProps[dashToCamel(att.nodeName)] = att.nodeValue;
                }
            }

            contentHTML = this.innerHTML;
            this.innerHTML = '';

            let tagCmp = cmp || globalTag || tag;

            this.dozApp = new Doz({
                root,
                useShadowRoot: !hasDataNoShadow,
                template(h) {
                    return h`
                    <${tagCmp}>${contentHTML}</${tagCmp}>
                `
                },
                onMountAsync() {
                    thisElement.removeAttribute('data-soft-entrance');
                    let firstChild = this.children[0];
                    firstChild.props = Object.assign({}, firstChild.props, initialProps);

                    let countCmp = Object.keys(data.webComponents.tags[tag]).length++;

                    data.webComponents.tags[tag][id || countCmp] = firstChild;
                    if (id !== null) {
                        if (data.webComponents.ids[id])
                            return console.warn(id + ': id already exists for DozWebComponent');

                        data.webComponents.ids[id] = firstChild;
                    }
                }
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.dozApp) return;
            let firstChild = this.dozApp.mainComponent.children[0];
            firstChild.props[dashToCamel(name)] = newValue;
        }
    });
}

function defineWebComponent(tag, cmp, observedAttributes = []) {
    createDozWebComponent(tag, cmp, observedAttributes, '');
}

function defineWebComponentFromGlobal(tag, globalTag, observedAttributes = []) {
    createDozWebComponent(tag, null, observedAttributes, '', globalTag);
}

module.exports = {
    defineWebComponent,
    defineWebComponentFromGlobal,
    createDozWebComponent
};
