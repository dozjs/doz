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

    if (!PARSER.REGEX.TAG.test(tag)){
        throw new TypeError('Tag must contain a dash (-): my-component');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        defaultProps: {},
        tpl: '<div></div>'
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
    const element = html.create(cmp.cfg.tpl);

    // Find placeholder into text
    textToTag(element);

    const nodes = html.getAllNodes(element);

    const propsMap = {};

    // Iterate props by HTMLElement attributes
    Array.from(cfg.props).forEach(prop => {
        props[prop.name] = prop.value;
    });

    nodes.forEach(child => {
        if (child.nodeType === 1) {
            Array.from(child.attributes).forEach(attr => {
                const key = attr.value.match(PARSER.REGEX.ATTR);

                if (key) {
                    const name = key[1];
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
    setProps(cmp.cfg.defaultProps, propsMap);
    setProps(props, propsMap);

    /*element[INSTANCE] = {
        tag: cmp.tag,
        propsMap,
        child: [],
        element
    };*/

    return {
        tag: cmp.tag,
        props,
        propsMap,
        child: [],
        element,
        setProps: function (newProps) {
            setProps(newProps, propsMap, props);
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

function setProps(newProps = {}, propsMap = {}, props) {
    const find = (newProps, targetProps) => {
        for (let p in newProps) {
            if (newProps.hasOwnProperty(p) && targetProps.hasOwnProperty(p)) {
                if (isSigned(targetProps[p])) {
                    //defaultProps[p] = newProps[p];
                    targetProps[p].nodeValue = newProps[p];
                } else if (typeof newProps[p] === 'object') {
                    find(newProps[p], targetProps[p]/*, defaultProps[p]*/);
                } else if (Array.isArray(targetProps[p])) {
                    targetProps[p].forEach((prop, i) => {
                        //console.log(defaultProps)
                        //defaultProps[i] = newProps[p];
                        prop.nodeValue = newProps[p];
                    });
                }
            }
        }
    };
    find(newProps, propsMap);
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
    createProp: createPropMap
};
