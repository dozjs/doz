const extend = require('defaulty');
const {register} = require('./collection');
const html = require('./html');
const {INSTANCE, PARSER, SIGN} = require('./constants');
const collection = require('./collection');
const copy = require('deep-copy');

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
        defaultProps: {},
        template: '<div></div>',
        methods: {}
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

                if (newElement.element.querySelectorAll('*').length) {
                    const nestedChild = getInstances(newElement.element.firstChild);
                    //console.log(nestedChild);
                    if (nestedChild.length) {
                        newElement.child = newElement.child.concat(nestedChild);
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
    const element = html.create(cmp.cfg.template);

    // Find placeholder into text
    textToTag(element);

    const nodes = html.getAllNodes(element);

    const propsMap = {};

    // Iterate props by HTMLElement attributes
    Array.from(cfg.props).forEach(prop => {
        props[prop.name] = prop.value;
    });

    nodes.forEach(child => {
        //console.log(child.nodeName);
        if (child.nodeType === 1) {
            Array.from(child.attributes).forEach(attr => {
                const placeholder = attr.value.match(PARSER.REGEX.ATTR);

                if (placeholder) {
                    const name = placeholder[1];
                    let component;

                    if (child.nodeName.toLowerCase() === PARSER.TAG.TEXT) {
                        component = document.createTextNode('');
                        textNodes.push({
                            old: child,
                            new: component
                        });
                    } else {
                        component = attr;
                    }

                    // Sign component
                    component[SIGN] = true;
                    createPropMap(name, propsMap, component);
                }
            });
        }
    });

    // Remove tag text added above
    tagToText(textNodes);

    //Set default data
    setProps(
        props,
        cmp.cfg.defaultProps,
        propsMap,
        true
    );

    return {
        tag: cmp.tag,
        props,
        propsMap,
        child: [],
        methods: cmp.cfg.methods,
        element,
        setProps: function (newProps) {
            setProps(
                this.props,
                copy(newProps),
                this.propsMap
            );
        },
        getProps: function () {
            return copy(this.props);
        }
    };
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

function setProps(currentProps, nextProps = {}, propsMap = {}, initialState = false) {
    if (initialState) {
        nextProps = extend.copy(nextProps, currentProps);
    }

    const find = (nextProps, targetProps) => {
        for (let p in nextProps) {
            if (nextProps.hasOwnProperty(p) && targetProps.hasOwnProperty(p)) {
                if (isSigned(targetProps[p])) {
                    currentProps[p] = updateProp(currentProps[p], nextProps[p], targetProps[p], initialState)
                } else if (typeof nextProps[p] === 'object') {
                    find(nextProps[p], targetProps[p], currentProps[p]);
                } else if (Array.isArray(targetProps[p])) {
                    targetProps[p].forEach((prop, i) => {
                        currentProps[p] = updateProp(currentProps[p], nextProps[p], prop, initialState)
                    });
                }
            }
        }
    };

    find(nextProps, propsMap);
}

function updateProp(current, next, map, disableEqualCheck) {
    if (next !== current || disableEqualCheck) {
        current = next;
        map.nodeValue = current;
    }
    return current;
}

function isSigned(n) {
    return n.hasOwnProperty(SIGN);
}

function textToTag(el) {
    el.innerHTML = el.innerHTML.replace(PARSER.REGEX.TEXT, function replacer(match) {
        // Remove spaces
        match = sanitize(match);
        return `<${PARSER.TAG.TEXT} value=${match}></${PARSER.TAG.TEXT}>`;
    });
}

function tagToText(textNodes) {
    textNodes.forEach(item => {
        item.old.parentNode.replaceChild(item.new, item.old)
    });
}

function sanitize(field) {
    return field.replace(/[ "=]/g, '');
}

module.exports = {
    Component,
    getInstances,
    setProps,
    createPropMap,
    updateProp
};
