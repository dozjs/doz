const extend = require('defaulty');
const {register} = require('../collection');
const html = require('../html');
const {INSTANCE, PARSER, SIGN} = require('../constants');
const collection = require('../collection');
const helper = require('./helper');
const observer = require('./observer');
const events = require('./events');

function Component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!PARSER.REGEX.TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-): my-component');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        template: '<div></div>',
        context: {}
    });

    register(cmp);
}

function getInstances(element) {
    const nodes = html.getAllNodes(element);
    let components = [];

    nodes.forEach(child => {
        if (child.nodeType === 1 && child.parentNode) {

            const cmp = collection.get(child.nodeName);

            if (cmp) {
                const newElement = createInstance(cmp, {
                    props: child.attributes
                });

                newElement.element[INSTANCE] = newElement;

                child.parentNode.replaceChild(newElement.element, child);
                components.push(newElement);

                events.callRender(newElement.context);

                if (newElement.element.querySelectorAll('*').length) {
                    const nestedChild = getInstances(newElement.element.firstChild);
                    //console.log(nestedChild);
                    if (nestedChild.length) {
                        newElement.child = newElement.child.concat(nestedChild);
                        newElement.context.child = newElement.child;
                    }
                }
            }
        }
    });

    return components;
}

function createInstance(cmp, cfg) {
    const textNodes = [];
    const props = {};
    const propsMap = {};
    const handlers = [];
    const fragment = html.create(cmp.cfg.template);

    // Find placeholder into text
    helper.textToTag(fragment);

    const nodes = html.getAllNodes(fragment);

    // Iterate props by HTMLElement attributes
    Array.from(cfg.props).forEach(prop => {
        props[prop.name] = prop.value;
    });

    nodes.forEach(child => {

        if (child.nodeType === 1) {
            Array.from(child.attributes).forEach(attr => {
                const placeholderMatch = attr.value.match(PARSER.REGEX.ATTR);
                const listenerMatch = attr.name.match(PARSER.REGEX.LISTENER);

                // Found listener
                if (listenerMatch) {
                    const event = listenerMatch[1];
                    const listener = attr.value;

                    handlers.push({
                        event,
                        listener,
                        element: child
                    });

                    // Found placeholder
                } else if (placeholderMatch) {
                    const placeholder = placeholderMatch[1];
                    let element;

                    if (child.nodeName.toLowerCase() === PARSER.TAG.TEXT) {
                        element = document.createTextNode('');
                        textNodes.push({
                            old: child,
                            new: element
                        });
                    } else {
                        element = attr;
                    }

                    // Sign component
                    element[SIGN] = true;
                    createPropMap(placeholder, propsMap, element);
                }
            });
        }
    });

    // Remove tag text added above
    helper.tagToText(textNodes);

    const contextProto = Object.defineProperties({}, {
        element: {
            enumerable: true,
            value: fragment,
            configurable: true
        },
        child: {
            enumerable: true,
            value: [],
            writable: true
        }
    });

    let context = Object.assign(contextProto, {});
    let isCreated = false;

    const instance = {
        tag: cmp.tag,
        props,
        propsMap,
        child: [],
        element: fragment,
        context: observer.create(context, false, change => {

            change.forEach(item => {
                const node = propsMap[item.currentPath];
                //console.log(node);
                if (node) {
                    if (Array.isArray(node)) {
                        node.forEach(n => {
                            n.nodeValue = item.newValue;
                        });
                    } else {
                        node.nodeValue = item.newValue;
                    }
                }
            });

            if (isCreated) {
                events.callUpdate(context);
            }
        })
    };

    // Set default
    setProps(instance.context, cmp.cfg.context);
    // Set props if exists
    setProps(instance.context, props);
    // Create eventual handlers
    createHandlers(instance.context, handlers);

    events.callCreate(instance.context);
    isCreated = true;

    return instance;
}

function createHandlers(context, handlers) {
    handlers.forEach(h => {
        if (h.listener in context && typeof context[h.listener] === 'function') {
            h.element.addEventListener(h.event, context[h.listener].bind(context));
        } else {
            h.element.addEventListener(h.event, function () {
                eval(h.listener);
            }.bind(context));
        }
        // Remove custom attribute
        h.element.removeAttribute('on-' + h.event);
    });
}

function setProps(targetObj, defaultObj) {
    for (let i in defaultObj) {
        if (defaultObj.hasOwnProperty(i))
            if (typeof targetObj[i] === 'object' && typeof defaultObj[i] !== 'undefined') {
                setProps(targetObj[i], defaultObj[i]);
            } else {
                targetObj[i] = defaultObj[i];
            }
    }
    return targetObj;
}

function createPropMap(name, props, component) {
    name.split('.').reduce((o, i, y, m) => {
        const isLast = m[m.length - 1] === i;
        if (isLast) {
            if (o.hasOwnProperty(i)) {
                if (!Array.isArray(o[i]))
                    o[i] = [o[i]];
                o[i].push(component)
            } else {
                o[i] = component;
            }
        } else if (!o.hasOwnProperty(i)) {
            o[i] = [];
        }

        return o[i]

    }, props);
}

module.exports = {
    Component,
    getInstances,
    setProps,
    createPropMap,
    createHandlers
};
