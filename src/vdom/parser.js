const castStringTo = require('../utils/cast-string-to');
const dashToCamel = require('../utils/dash-to-camel');
const {REGEX, ATTR, TAG} = require('../constants');

function serializeProps(node) {
    const props = {};

    if (node.attributes) {
        const attributes = Array.from(node.attributes);
        for (let j = attributes.length - 1; j >= 0; --j) {
            let attr = attributes[j];

            propsFixer(node.nodeName, attr.name, attr.nodeValue, props);

        }
    }
    return props;
}

function propsFixer(nName, aName, aValue, props) {
    let isComponentListener = aName.match(REGEX.IS_COMPONENT_LISTENER);
    if (isComponentListener) {
        if (props[ATTR.LISTENER] === undefined)
            props[ATTR.LISTENER] = {};
        props[ATTR.LISTENER][isComponentListener[1]] = aValue;
        delete props[aName];
    } else {
        if (REGEX.IS_STRING_QUOTED.test(aValue))
            aValue = aValue.replace(/"/g, '&quot;');
        props[
            REGEX.IS_CUSTOM_TAG.test(nName)
                ? dashToCamel(aName)
                : aName
            ] = aName === ATTR.FORCE_UPDATE
            ? true
            : castStringTo(aValue);
    }
}

function transform(node) {

    let root = {};

    function walking(node, parent) {
        while (node) {
            let obj;

            if (node.nodeType === 3) {
                obj = node.nodeValue;
            } else if (node.nodeName.toLowerCase() === TAG.TEXT_NODE_PLACE){
                obj = node.innerText;
            } else {
                obj = {};
                obj.type = node.nodeName;
                obj.children = [];
                obj.props = serializeProps(node);
                obj.isSVG = typeof node.ownerSVGElement !== 'undefined';
            }

            if (!Object.keys(root).length)
                root = obj;

            if (parent && parent.children) {
                parent.children.push(obj);
            }

            if (node.hasChildNodes()) {
                walking(node.firstChild, obj);
            }

            node = node.nextSibling
        }
    }

    walking(node, root);

    return root;
}

module.exports = {
    transform,
    serializeProps,
    propsFixer
};