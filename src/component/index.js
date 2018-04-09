const extend = require('defaulty');
const {register} = require('../collection');
const html = require('../html');
const {INSTANCE, PARSER, SIGN} = require('../constants');
const collection = require('../collection');
const helper = require('./helper');
const observer = require('./observer');
const events = require('./events');
const {updateElement} = require('../vdom/index');
const {transform} = require('../vdom/parser').transform;

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

}

function updateComponent(changes, propsMap) {

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
    component,
    getInstances,
    setProps
};
