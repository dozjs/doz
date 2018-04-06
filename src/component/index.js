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
    const listenerHandler = [];
    const listenerModel = [];
    const fragment = html.create(cmp.cfg.template);
    let placeholderMatch = null;
    let handlerMatch = null;
    let modelMatch = null;
    let forMatch = null;
    let ifMatch = null;

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
                forMatch = PARSER.REGEX.FOR.test(attr.name);
                ifMatch = PARSER.REGEX.IF.test(attr.name);

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

                }  else if (forMatch) {
                    // Get content model
                    let content = child.innerHTML;
                    // Remove content
                    child.innerHTML = '';

                    for (let i in [0,1,2,3,4]) {
                        child.innerHTML += '['+i+'] ' + content;
                    }

                }  else if (ifMatch) {


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
                    helper.createObjectMap(placeholder, propsMap, element);
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
                        // Create structure if not exist and set value
                        helper.createObjectMap(m.field, context, this.value, true);
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
        if (defaultObj.hasOwnProperty(i)) {
            if (typeof targetObj[i] === 'object' && typeof defaultObj[i] !== 'undefined') {
                setProps(targetObj[i], defaultObj[i]);
                // Set a copy of data
            } else if (i === 'data' && typeof defaultObj[i] === 'function') {
                let data = defaultObj[i]();

                if (typeof data === 'object') {
                    for (let j in data) {
                        if (data.hasOwnProperty(j) && !targetObj.hasOwnProperty(j)) {
                            targetObj[j] = typeof data[j] === 'object' ? Object.assign({}, data[j]) : data[j]
                        }
                    }
                }
            } else {
                targetObj[i] = defaultObj[i];
            }
        }
    }
    return targetObj;
}

function isSigned(n) {
    return n.hasOwnProperty(SIGN);
}


module.exports = {
    Component,
    getInstances,
    setProps,
    createListenerHandler
};
