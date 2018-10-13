const castStringTo = require('../utils/cast-string-to');
const dashToCamel = require('../utils/dash-to-camel');
const {REGEX, ATTR, TAG} = require('../constants');

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
    return str.replace(/\n\s+/gm, ' ');
}

class Element {

    constructor(name, props, isSVG) {
        this.type = name;
        this.props = Object.assign({}, props);
        this.children = [];
        this.isSVG = isSVG || REGEX.IS_SVG.test(name);
    }

    appendChild(node) {
        this.children.push(node);
        return node;
    }

}

function compile(data) {

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
                if (text)
                    currentParent.appendChild(text);
            }
        }

        lastTextPos = REGEX.HTML_MARKUP.lastIndex;
        if (match[0][1] === '!') {
            // this is a comment
            continue;
        }

        // exclude special text node
        if (new RegExp(`<\/?${TAG.TEXT_NODE_PLACE}?>$`).test(match[0])) {
            continue;
        }

        if (!match[1]) {
            // not </ tags
            props = {};
            for (let attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
                props[attMatch[2]] = attMatch[5] || attMatch[6] || '';
                propsFixer(
                    match[0].substring(1, match[0].length-1),
                    attMatch[2],
                    props[attMatch[2]],
                    props
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

module.exports = {
    compile,
    serializeProps,
    propsFixer
};