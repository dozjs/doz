const Doz = require('./Doz');
const data = require('./data');

function createExtWebComponent(tag, cmp) {

    document.addEventListener('DOMContentLoaded', (event) => {

        data.extWebComponents.tags[tag] = data.extWebComponents.tags[tag] || {};

        customElements.define('ext-' + tag, class extends HTMLElement {
            constructor() {
                super();
            }

            connectedCallback() {
                let initialProps = {};
                let id = null;
                let contentHTML = '';

                for (let att, i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                    att = atts[i];
                    if (att.nodeName === 'data-id') {
                        id = att.nodeValue;
                        continue;
                    }
                    initialProps[att.nodeName] = att.nodeValue;
                }

                contentHTML = this.innerHTML;
                this.innerHTML = '';

                let tagCmp = cmp || tag;

                new Doz({
                    root: this,
                    template(h) {
                        return h`
                        <${tagCmp}>${contentHTML}</${tagCmp}>
                    `
                    },
                    onMount() {
                        //thisWC.innerHTML = ''
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
                        //console.log(tag, data.extWebComponents);
                        //console.log(thisWC.innerHTML)
                    }
                });
            }
        });
    });
}

module.exports = createExtWebComponent;