const extend = require('defaulty');
const {register} = require('../collection');
const html = require('../utils/html');
const {REGEX, ATTR, TAG} = require('../constants');
const collection = require('../collection');
const observer = require('./observer');
const events = require('./events');
const {transform, serializeProps} = require('../vdom/parser');
const update = require('../vdom').updateElement;
const castStringTo = require('../utils/cast-string-to');

function component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-): my-component');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        template() {
            return '<div></div>'
        },
        props: {}
    });

    register(cmp);
}

function getInstances(root, template, localComponents) {

    template = typeof template === 'string'
        ? html.create(template)
        : template;

    const nodes = html.getAllNodes(template);
    let components = {};
    let index = 0;

    //console.log(nodes);

    nodes.forEach(child => {
        if (child.nodeType === 1 && child.parentNode) {

            const cmp = collection.get(child.nodeName) || localComponents[child.nodeName.toLowerCase()];
            if (cmp) {

                let alias = index ;//+ Object.keys(components).length++;
                index++;
                const props = serializeProps(child);
                //console.log('props',props);
                if (props.hasOwnProperty(ATTR.ALIAS)) {
                    alias = props[ATTR.ALIAS];
                    delete  props[ATTR.ALIAS];
                }

                //console.log('ATTR.ALIAS',ATTR.ALIAS);
                //console.log('ALIAS',alias);

                const newElement = createInstance(cmp, {
                    root,
                    props
                });

                // Remove old
                child.parentNode.removeChild(child);
                newElement.render();

                events.callRender(newElement);

                components[alias] = newElement;

                const nested = newElement._rootElement.querySelectorAll('*');

                Array.from(nested).forEach(item => {
                    if (REGEX.IS_CUSTOM_TAG.test(item.nodeName) && item.nodeName.toLowerCase() !== TAG.ROOT) {
                        //index++;
                        const template = item.outerHTML;
                        const rootElement = document.createElement(item.nodeName);
                        item.parentNode.replaceChild(rootElement, item);
                        const cmps = getInstances(rootElement, template, localComponents);

                        Object.keys(cmps).forEach(i => {
                            let n = i;
                            if (newElement.children.hasOwnProperty(n)) {
                                if (typeof castStringTo(n) === 'number') {
                                    n++
                                }
                            }
                                newElement.children[n] = cmps[i]

                        })

                    } else {
                    }
                });
            } else {
            }
        }
    });

    return components;
}

function createInstance(cmp, cfg) {
    const props = extend.copy(cfg.props, typeof cmp.cfg.props === 'function'
        ? cmp.cfg.props()
        : cmp.cfg.props
    );

    //console.log(props, cfg.props);

    let isCreated = false;

    const instance = Object.defineProperties({}, {
        _prev: {
            value: null,
            writable: true
        },
        _prevProps: {
            value: null,
            writable: true
        },
        _rootElement: {
            value: null,
            writable: true
        },
        _boundElements: {
            value: {},
            writable: true
        },
        ref: {
            value: {},
            writable: true,
            enumerable: true
        },
        children: {
            value: {},
            writable: true,
            enumerable: true
        },
        tag: {
            value: cmp.tag,
            enumerable: true
        },
        each: {
            value: function (obj, func) {
                if (Array.isArray(obj))
                    return obj.map(func).join('');
            },
            enumerable: true
        },
        render: {
            value: function () {
                const tpl = html.create(`<${TAG.ROOT}>${this.template()}</${TAG.ROOT}>`);
                //console.log(this.template());
                //console.log(tpl);
                const next = transform(tpl);
                const rootElement = update(cfg.root, next, this._prev, 0, this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
            },
            enumerable: true
        },
        destroy: {
            value: function () {
                if (!this._rootElement) return;
                this._rootElement.parentNode.removeChild(this._rootElement);
                events.callDestroy(this);
            },
            enumerable: true
        }
    });

    // Assign cfg to instance
    Object.assign(instance, cmp.cfg);

    // Create observer to props
    instance.props = observer.create(props, true, changes => {
        instance.render();

        changes.forEach(item => {
            if (instance._boundElements.hasOwnProperty(item.property)) {
                instance._boundElements[item.property].forEach(element => {
                    element.value = item.newValue;
                })
            }
        });

        if (isCreated) {
            events.callUpdate(instance);
        }
    });

    observer.beforeChange(instance.props, () => {
        const res = events.callBeforeUpdate(Object.assign({}, instance.props));
        if (res === false)
            return false;
    });

    events.callCreate(instance);
    isCreated = true;

    return instance;
}

module.exports = {
    component,
    getInstances
};