//const castStringTo = require('../utils/cast-string-to');
const dashToCamel = require('../utils/dash-to-camel');
const isListener = require('../utils/is-listener');
const {REGEX, ATTR, TAG, PROPS_ATTRIBUTES} = require('../constants');
const regExcludeSpecial = new RegExp(`<\/?(${TAG.TEXT_NODE_PLACE}|${TAG.ITERATE_NODE_PLACE})?>$`);
const directive = require('../directives');
const mapper = require('./mapper');
//const eventsAttributes = require('../utils/events-attributes');

const selfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
};

const elementsClosedByOpening = {
    li: {li: true},
    p: {p: true, div: true},
    td: {td: true, th: true},
    th: {td: true, th: true}
};

const elementsClosedByClosing = {
    li: {ul: true, ol: true},
    a: {div: true},
    b: {div: true},
    i: {div: true},
    p: {div: true},
    td: {tr: true, table: true},
    th: {tr: true, table: true}
};

function last(arr) {
    return arr[arr.length - 1];
}

function removeNLS(str) {
    return str.replace(REGEX.MATCH_NLS, '');
}

class Element {

    constructor(name, props, isSVG) {
        this.type = name;
        this.props = props;//Object.assign({}, props);
        this.children = [];
        this.isSVG = isSVG || REGEX.IS_SVG.test(name);
        if (props.key !== undefined)
            this.key = props.key;
        this.hasKeys = undefined;
    }

    appendChild(node) {
        if (node.props && node.props.key !== undefined) {
            this.hasKeys = true;
        }
        this.children.push(node);
        return node;
    }

}

function compile(data, cmp) {

    if (!data) return '';

    const root = new Element(null, {});
    const stack = [root];
    let currentParent = root;
    let lastTextPos = -1;
    let match;
    let props;

    while (match = REGEX.HTML_MARKUP.exec(data)) {

        if (lastTextPos > -1) {
            if (lastTextPos > -1 && lastTextPos + match[0].length < REGEX.HTML_MARKUP.lastIndex) {
                // remove new line space
                const text = removeNLS(data.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                // if has content
                if (text) {
                    let possibleCompiled = mapper.get(text.trim());
                    if (!Array.isArray(possibleCompiled))
                        currentParent.appendChild(possibleCompiled === undefined ? text : possibleCompiled);
                }
            }
        }

        lastTextPos = REGEX.HTML_MARKUP.lastIndex;
        if (match[0][1] === '!') {
            // this is a comment or style
            continue;
        }

        // exclude special text node
        if (regExcludeSpecial.test(match[0])) {
            continue;
        }

        // transform slot to dz-slot
        if (match[2] === 'slot')
            match[2] = TAG.SLOT;

        if (!match[1]) {
            // not </ tags
            props = {};
            for (let attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
                props[attMatch[2]] = removeNLS(attMatch[5] || attMatch[6] || '');
                propsFixer(
                    match[0].substring(1, match[0].length - 1),
                    attMatch[2],
                    props[attMatch[2]],
                    props,
                    null
                )
            }

            if (!match[4] && elementsClosedByOpening[currentParent.type]) {
                if (elementsClosedByOpening[currentParent.type][match[2]]) {
                    stack.pop();
                    currentParent = last(stack);
                }
            }

            currentParent = currentParent.appendChild(new Element(match[2], props, currentParent.isSVG));
            stack.push(currentParent);
        }

        if (match[1] || match[4] || selfClosingElements[match[2]]) {
            // </ or /> or <br> etc.
            while (true) {
                if (currentParent.type === match[2]) {
                    stack.pop();
                    currentParent = last(stack);
                    break;
                } else {
                    // Trying to close current tag, and move on
                    if (elementsClosedByClosing[currentParent.type]) {
                        if (elementsClosedByClosing[currentParent.type][match[2]]) {
                            stack.pop();
                            currentParent = last(stack);
                            continue;
                        }
                    }
                    // Use aggressive strategy to handle unmatching markups.
                    break;
                }
            }
        }
    }

    if (root.children.length > 1) {
        root.type = TAG.ROOT;
    } else if (root.children.length) {
        return root.children[0];
    }

    return root;
}

function serializeProps($node) {
    const props = {};

    if ($node[PROPS_ATTRIBUTES]) {
        let keys = Object.keys($node[PROPS_ATTRIBUTES]);
        for (let i = 0; i < keys.length; i++) {
            propsFixer($node.nodeName, keys[i], $node[PROPS_ATTRIBUTES][keys[i]], props, $node);
        }
    } else if ($node.attributes) {
        const attributes = Array.from($node.attributes);
        for (let j = attributes.length - 1; j >= 0; --j) {
            let attr = attributes[j];
            propsFixer($node.nodeName, attr.name, attr.nodeValue, props, $node);
        }
    }
    return props;
}

function propsFixer(nName, aName, aValue, props, $node) {

    if (typeof aValue === 'string' && REGEX.IS_STRING_QUOTED.test(aValue))
        aValue = aValue.replace(REGEX.REPLACE_QUOT, '&quot;');

    let isDirective = REGEX.IS_DIRECTIVE.test(aName);

    let propsName = REGEX.IS_CUSTOM_TAG.test(nName) && !isDirective
        ? dashToCamel(aName)
        : aName;

    if ($node) {
        directive.callAppComponentPropsAssignName($node, aName, aValue, isDirective, props, newPropsName => {
            propsName = newPropsName;
        });
    }
    // Bisogna poter gestire più placeholder nella stessa stringa
    // magari utilizzando la callback della funziona replace
    // inoltre è necessario escludere le stringhe provenienti da
    // attributi come gli eventi onclick ecc... perchè al momento vengono composti
    // dentro il modulo attributes.js

    //if (typeof aValue === 'string' && !mapCompiled.isValidId(aValue) && !eventsAttributes.includes(aName)) {
    if (typeof aValue === 'string' && !mapper.isValidId(aValue) && !isListener(aName)) {
        aValue = mapper.getAll(aValue);
    } else {
        let objValue = mapper.get(aValue);
        if (objValue !== undefined) {
            aValue = objValue;
        }
    }

    //console.log('AFTER :', aName, aValue)
    props[propsName] = aName === ATTR.FORCE_UPDATE
        ? true
        : aValue;
}

module.exports = {
    compile,
    serializeProps,
    propsFixer,
    Element,
    removeNLS,
    last
};