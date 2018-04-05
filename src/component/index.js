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
                const newElement = new CreateInstance(cmp, {
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

function CreateInstance(cmp, cfg) {
    const textNodes = [];
    const props = {};
    const propsMap = {};
    const listenerHandler = [];
    const listenerModel = [];
    const fragment = html.create(cmp.cfg.template);
    let placeholderMatch = null;
    let handlerMatch = null;
    let modelMatch = null;

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
                placeholderMatch = attr.value.match(PARSER.REGEX.ATTR);
                handlerMatch = attr.name.match(PARSER.REGEX.HANDLER);
                modelMatch = helper.canModel(child) ? PARSER.REGEX.MODEL.test(attr.name) : false;

                //console.log(modelMatch, attr.name, helper.canModel(child), PARSER.REGEX.MODEL.test(attr.name));

                // Found listener
                if (handlerMatch) {
                    listenerHandler.push({
                        event: handlerMatch[1],
                        listener: attr.value,
                        element: child
                    });
                    // Found model
                } else if (modelMatch) {
                    listenerModel.push({
                        field: attr.value,
                        element: child
                    });

                    //createPropMap(attr.value, propsMap, child);

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

    let context = {};
    let isCreated = false;

    const instance = {
        tag: cmp.tag,
        props,
        propsMap,
        child: [],
        element: fragment,
        context: observer.create(context, false, change => {

            change.forEach(item => {
                //console.log(item.currentPath, item.newValue);
                //if (item.type !== 'update') return;
                //const node = propsMap[item.currentPath];

                // Exclude child property from changes event
                if (item.currentPath === 'child') return;

                const nodes = helper.pathify(item);

                for (let path in nodes) {
                    if (nodes.hasOwnProperty(path)) {
                        //console.log(path);
                        const node = helper.getByPath(path, propsMap);
                        const nodeValue = nodes[path];

                        if (node) {
                            if (Array.isArray(node)) {
                                node.forEach(n => {
                                    n.nodeValue = nodeValue;
                                });
                            } else {
                                node.nodeValue = nodeValue;
                            }
                        }
                    }
                }
            });

            if (isCreated) {
                events.callUpdate(context);
            }
        })
    };

    Object.defineProperties(instance.context, {
        element: {
            enumerable: true,
            value: function () {
                return instance.element
            },
            configurable: true
        },
        child: {
            enumerable: true,
            value: [],
            writable: true
        }
    });

    // Transform function data to object data
    if (cmp.cfg.context.data && typeof cmp.cfg.context.data === 'function') {
        console.log(this);
        cmp.cfg.context.data = cmp.cfg.context.data();
    }

    // Set default
    setProps(instance.context, cmp.cfg.context);
    // Set props if exists
    setProps(instance.context, props);
    // Create eventual handlers
    createListenerHandler(instance.context, listenerHandler);
    // Create eventual listener for model
    createListenerModel(instance.context, listenerModel);

    events.callCreate(instance.context);
    isCreated = true;

    //console.log(propsMap)

    return instance;
}

function createListenerModel(context, models) {

    models.forEach(m => {
        if (typeof context[m.field] !== 'function') {
            ['compositionstart', 'compositionend', 'input', 'change']
                .forEach(function (event) {
                    m.element.addEventListener(event, function () {
                        const path = helper.getLastObjectByPath(m.field, context);

                        //console.log(m.field, 'path',path);

                        //TODO Make object structure if not exists

                        //if (typeof path === 'undefined')
                        //  throw new Error('object not found at ' + m.field);

                        if (typeof path === 'object') {
                            for (let i in path) {
                                if (path.hasOwnProperty(i))
                                    path[i] = this.value;
                            }
                        } else {
                            context[m.field] = this.value;
                        }

                    });
                });
        }

        m.element.removeAttribute('do-model');
    });
}

function createListenerHandler(context, handlers) {
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

function isSigned(n) {
    return n.hasOwnProperty(SIGN);
}


module.exports = {
    Component,
    getInstances,
    setProps,
    createPropMap,
    createListenerHandler
};
