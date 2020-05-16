const Doz = require('./Doz');
const data = require('./data');

function createExtWebComponent(tag, cmp, observedAttributes = []) {

    data.extWebComponents.tags[tag] = data.extWebComponents.tags[tag] || {};

    customElements.define('ext-' + tag, class extends HTMLElement {
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

            for (let att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                att = atts[i];
                if (att.nodeName === 'data-id') {
                    id = att.nodeValue;
                    continue;
                }
                if (observedAttributes.includes(att.nodeName)) {
                    initialProps[att.nodeName] = att.nodeValue;
                }
            }

            contentHTML = this.innerHTML;
            this.innerHTML = '';

            let tagCmp = cmp || tag;

            this.dozApp = new Doz({
                root: shadow,
                isExtWebComponent: true,
                template(h) {
                    return h`
                    <${tagCmp}>${contentHTML}</${tagCmp}>
                `
                },
                onMountAsync() {
                    let firstChild = this.children[0];
                    firstChild.props = Object.assign({}, firstChild.props, initialProps);

                    let countCmp = Object.keys(data.extWebComponents.tags[tag]).length++;

                    data.extWebComponents.tags[tag][id || countCmp] = firstChild;
                    if (id !== null) {
                        if (data.extWebComponents.ids[id])
                            return console.warn(id + ': id already exists for ExtWebComponent');

                        data.extWebComponents.ids[id] = firstChild;
                    }
                }
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.dozApp) return;
            let firstChild = this.dozApp.mainComponent.children[0];
            firstChild.props[name] = newValue;
        }
    });
}

module.exports = createExtWebComponent;