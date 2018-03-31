const extend = require('defaulty');
const {register} = require('./collection');
const html = require('./html');
const {INSTANCE, PARSER, SIGN} = require('./constants');
const collection = require('./collection');

function Component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        data: {},
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

                const newChild = createInstance(cmp, {
                    props: child.attributes
                });

                child.parentNode.replaceChild(newChild, child);
                components.push(newChild);

                //console.log(newChild);

                if (newChild.querySelectorAll('*').length)
                    components = components.concat(getInstances(newChild));
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

    const allNodes = [];

    Array.from(cfg.props).forEach(prop => {
        props[prop.name] = prop.value;
    });
    //console.log('bbbbb', element.nodeName);
    // Now need to mapping all placeholder in html and convert them in node
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

                    //console.log(component.nodeValue)
                    // Sign component
                    component[SIGN] = true;
                    createProp(name, propsMap, component);
                    //allNodes.push({name, component});
                }
            });
        }
    });

    // Remove tag text added above
    tagToText(textNodes);

    //console.log(props);
    //console.log(propsMap);

    /*allNodes.forEach(node => {
        createProp(node.name, propsMap, node.component);
    });*/


    setProps(props, propsMap);



    element[INSTANCE] = {
        owner: cmp.tag,
        propsMap
    };
    //console.log('AAAAA', element);
    return element;
}

function createProp(name, props, component) {
    name.split('.').reduce((o, i, y, m) => {
        const isLast = m[m.length - 1] === i;
        if (isLast) {
            if (o.hasOwnProperty(i)) {
                if (!o[i].length)
                    o[i] = [component];
                else {
                    if (!Array.isArray(o[i]))
                        o[i] = [o[i]];
                    o[i].push(component)
                }
            } else {
                o[i] = component;
            }
        } else if (!o.hasOwnProperty(i)) {
            o[i] = [];
        }

        return o[i]

    }, props);
}

function setProps(props = {}, propsMap = {}) {
    const find = (props, targetProps) => {
        for (let p in props) {
            if (props.hasOwnProperty(p) && targetProps.hasOwnProperty(p)) {
                targetProps[p].nodeValue = props[p];
            }
        }
    };
    find(props, propsMap);
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
    createProp
};
