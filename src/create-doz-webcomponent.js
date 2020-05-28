const Doz = require('./Doz');
const data = require('./data');
const dashToCamel = require('./utils/dash-to-camel');

function createStyleSoftEntrance() {
    if (!document.getElementById('style--soft-entrance--')) {
        const style = document.createElement('style');
        style.id = 'style--soft-entrance--';
        style.innerHTML = `[data-soft-entrance] {visibility: hidden!important;}`;
        document.head.appendChild(style);
    }
}

createStyleSoftEntrance();

function createDozWebComponent(tag, cmp, observedAttributes = []) {

    data.dozWebComponents.tags[tag] = data.dozWebComponents.tags[tag] || {};

    customElements.define('dwc-' + tag, class extends HTMLElement {
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
            let shadow = this.attachShadow({mode: 'open'});

            let thisElement = this;
            let nodeCamelize;
            for (let att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                att = atts[i];
                if (att.nodeName === 'data-id') {
                    id = att.nodeValue;
                    continue;
                }
                nodeCamelize = dashToCamel(att.nodeName);
                if (observedAttributes.includes(nodeCamelize)) {
                    initialProps[nodeCamelize] = att.nodeValue;
                }
            }

            contentHTML = this.innerHTML;
            this.innerHTML = '';

            let tagCmp = cmp || tag;

            this.dozApp = new Doz({
                root: shadow,
                isDozWebComponent: true,
                template(h) {
                    return h`
                    <${tagCmp}>${contentHTML}</${tagCmp}>
                `
                },
                onMountAsync() {
                    thisElement.removeAttribute('data-soft-entrance');
                    let firstChild = this.children[0];
                    firstChild.props = Object.assign({}, firstChild.props, initialProps);

                    let countCmp = Object.keys(data.dozWebComponents.tags[tag]).length++;

                    data.dozWebComponents.tags[tag][id || countCmp] = firstChild;
                    if (id !== null) {
                        if (data.dozWebComponents.ids[id])
                            return console.warn(id + ': id already exists for DozWebComponent');

                        data.dozWebComponents.ids[id] = firstChild;
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

module.exports = createDozWebComponent;