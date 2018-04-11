const extend = require('defaulty');
const {register} = require('../collection');
const html = require('../utils/html');
const {INSTANCE, PARSER, SIGN} = require('../constants');
const collection = require('../collection');
//const helper = require('./helper');
const observer = require('./observer');
const events = require('./events');
const {transform, serializeProps} = require('../vdom/parser');
const update = require('../vdom').updateElement;

function component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!PARSER.REGEX.TAG.test(tag)) {
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

function getInstances(root, template) {

    template = typeof template === 'string'
        ? html.create(template)
        : template;

    //console.log(template.innerHTML)

    const nodes = html.getAllNodes(template);
    let components = [];

    nodes.forEach(child => {

        if (child.nodeType === 1 && child.parentNode) {

            const cmp = collection.get(child.nodeName);

            if (cmp) {
                let alias = Math.random();
                const props = serializeProps(child);

                if (props.hasOwnProperty('is-alias')) {
                    alias = props['is-alias']
                }

                const newElement = createInstance(cmp, {
                    root,
                    props,
                });

                // Remove old
                child.parentNode.removeChild(child);
                newElement.render();

                events.callRender(newElement);

                components.push({[alias]:newElement});

                const nested = newElement._rootElement.querySelectorAll('*');

                Array.from(nested).forEach(item => {
                    if (PARSER.REGEX.TAG.test(item.nodeName)) {
                        const template = item.outerHTML;
                        const rootElement = document.createElement(item.nodeName);
                        item.parentNode.replaceChild(rootElement, item);
                        getInstances(rootElement, template);
                    }
                });
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
    let instance = {};
    let isCreated = false;

    Object.defineProperties(instance, {
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
        each: {
            value: function (obj, func) {
                return obj.map(func).join('');
            },
            enumerable: true
        },
        render: {
            value: function () {
                const tpl = html.create(this.template());
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

    instance = Object.assign(instance, cmp.cfg);

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