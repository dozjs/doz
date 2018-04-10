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

    template = html.create(template);
    const nodes = html.getAllNodes(template);
    let components = [];

    nodes.forEach(child => {

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

                /*
                newElement.element[INSTANCE] = newElement;

                child.parentNode.replaceChild(newElement.element, child);
                components.push(newElement);

                events.callRender(newElement.context);

                if (newElement.element.querySelectorAll('*').length) {
                    const nestedChild = getInstances(newElement.element.firstChild);
                    if (nestedChild.length) {
                        newElement.child = newElement.child.concat(nestedChild);
                        newElement.context.child = newElement.child;
                    }
                }
                */
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
        each: {
            value: function (obj, func) {
                return obj.map(func).join('');
            },
            enumerable: true
        },
        render: {
            value: function () {
                let tpl = html.create(this.template());
                let next = transform(tpl);
                //console.log(next);
                update(cfg.root, next, this._prev, 0, this);

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
        //console.log('before change')
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
