const Doz = require('./Doz');
const appCreate = require('./app-create');
const data = require('./data');
const dashToCamel = require('./utils/dash-to-camel');
require('./utils/create-style-soft-entrance')();

function createDozWebComponent(tag, cmp, observedAttributes = [], prefix = 'dwc', globalTag, exposedMethods = [], exposedListeners = []) {

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

            let onAppReady = function () {
                let firstChild = this.children[0] || this;
                exposedMethods.forEach(method => {
                    if (firstChild[method]) {
                        thisElement[method] = firstChild[method].bind(firstChild);
                    }
                })
                thisElement.removeAttribute('data-soft-entrance');
                firstChild.props = Object.assign({}, firstChild.props, initialProps);
                let countCmp = Object.keys(data.webComponents.tags[tag]).length++;
                data.webComponents.tags[tag][id || countCmp] = firstChild;
                if (id !== null) {
                    if (data.webComponents.ids[id])
                        return console.warn(id + ': id already exists for DozWebComponent');

                    data.webComponents.ids[id] = firstChild;
                }
            };

            let onAppEmit = function (event, ...args) {
                if (exposedListeners.indexOf(event) > -1) {
                    let eventInstance = new CustomEvent(event, {
                        detail: args
                    });
                    thisElement.dispatchEvent(eventInstance);
                }
            }

            contentHTML = this.innerHTML.trim();
            this.innerHTML = '';

            let tagCmp = cmp || globalTag || tag;

            //console.log(contentHTML)

            if (cmp && typeof cmp !== "object") {

                cmp.__postListeners = {
                    onAppReady
                }

                this.dozApp = appCreate(root, cmp,{
                    useShadowRoot: !hasDataNoShadow,
                    innerHTML: contentHTML,
                    onAppEmit
                });
            } else {
                this.dozApp = new Doz({
                    root,
                    useShadowRoot: !hasDataNoShadow,
                    //language=HTML
                    template(h) {
                        return h`
                            <${tagCmp}>${contentHTML}</${tagCmp}>
                        `
                    },
                    onAppReady,
                    onAppEmit
                });
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.dozApp) return;
            let firstChild = this.dozApp.mainComponent.children[0] || this.dozApp.mainComponent;
            firstChild.props[dashToCamel(name)] = newValue;
        }
    });
}

function defineWebComponent(tag, cmp, observedAttributes = [], exposedMethods = [], exposedListeners = []) {
    createDozWebComponent(tag, cmp, observedAttributes, '', null, exposedMethods, exposedListeners);
}

function defineWebComponentFromGlobal(tag, globalTag, observedAttributes = [], exposedMethods = [], exposedListeners = []) {
    createDozWebComponent(tag, null, observedAttributes, '', globalTag, exposedMethods, exposedListeners);
}

module.exports = {
    defineWebComponent,
    defineWebComponentFromGlobal,
    createDozWebComponent
};
