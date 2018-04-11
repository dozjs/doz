const extend = require('defaulty');
const {register} = require('../collection');
const html = require('../utils/html');
const {INSTANCE, PARSER, SIGN} = require('../constants');
const collection = require('../collection');
const helper = require('./helper');
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
    const nodes = html.getAllNodes(template);
    let components = [];

    nodes.forEach((child, i) => {

        //console.log(child.nodeName)

        if (child.nodeType === 1 && child.parentNode) {

            const cmp = collection.get(child.nodeName);

            if (cmp) {

                const newElement = createInstance(cmp, {
                    root,
                    props: serializeProps(child)
                });

                // Remove old
                child.parentNode.removeChild(child);
                newElement.render();

                events.callRender(newElement);

                //console.log(i);

                const nested = newElement._rootElement.querySelectorAll('*');

                Array.from(nested).forEach(item => {

                    //console.log(item.nodeName);
                    //console.log(nested);

                    if (PARSER.REGEX.TAG.test(item.nodeName)) {
                        const template = item.outerHTML;
                        const rootElement = document.createElement('doz-root-component');
                        item.parentNode.replaceChild(rootElement, item);
                        getInstances(rootElement, template);
                    }


                    /*if (nestedChild.length) {
                        newElement.child = newElement.child.concat(nestedChild);
                        //newElement.context.child = newElement.child;
                    }*/
                });
                console.log('--------------------------')
            }
        }
    });

    return components;
}

function createInstance(cmp, cfg) {
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
                //console.log(next);
                const rootElement = update(cfg.root, next, this._prev, 0, this);

                if (!this._rootElement && rootElement) {
                    this._rootElement = rootElement;
                }

                this._prev = next;
                this._prevProps = Object.assign({}, this.props);
            },
            enumerable: true
        }
    });

    instance = Object.assign(instance, cmp.cfg);

    let props = extend.copy(cfg.props, cmp.cfg.props);

    instance.props = observer.create(props, true, () => {
        instance.render();

        if (isCreated) {
            events.callUpdate(instance);
        }
    });

    observer.beforeChange(instance.props, change => {
        const res = events.callBeforeUpdate(Object.assign({}, instance));
        if (res === false)
            return false;
    });

    events.callCreate(instance);
    isCreated = true;

    return instance;
}


module.exports = {
    component,
    getInstances,
    //setProps,
    //createListenerHandler
};
