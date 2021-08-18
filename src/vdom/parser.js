//const castStringTo = require('../utils/cast-string-to');
const dashToCamel = require('../utils/dash-to-camel');
//const isListener = require('../utils/is-listener');
const {REGEX, ATTR, TAG, PROPS_ATTRIBUTES} = require('../constants');
const regExcludeSpecial = new RegExp(`<\/?(${TAG.TEXT_NODE_PLACE}|${TAG.ITERATE_NODE_PLACE})?>$`);
const directive = require('../directives');
const {isDirective} = require('../directives/helpers');
//const mapper = require('./mapper');
//const eventsAttributes = require('../utils/events-attributes');
const {tplCache} = require('./stores');

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
/*
function removeDoubleQuotes(str) {
    if (typeof str === 'string') {
        if (str === '""' || str === "''")
            return '';
    }
    return str;
}
*/

class Element {

    constructor(name, props, isSVG, style, styleScoped) {
        this.type = name;
        this.props = props;//Object.assign({}, props);
        this.children = [];
        if (style)
            this.style = style;
        if (styleScoped)
            this.styleScoped = styleScoped;
        if (isSVG || name === 'svg')
            this.isSVG = true;
        if (props.key !== undefined)
            this.key = props.key;
        //this.hasKeys = undefined;
    }

    appendChild(node) {
        if (node.props && node.props.key !== undefined) {
            this.hasKeys = true;
        }
        this.children.push(node);
        return node;
    }

}

function compile(tpl) {
    if (!tpl) return '';
    //console.log(tpl)
    if (tplCache[tpl]) {
        //console.log('CACHED')
        //console.log(tplCache[tpl])
        return tplCache[tpl]
    }

    const root = new Element(null, {});
    const stack = [root];
    let currentParent = root;
    let lastTextPos = -1;
    let match;
    let props;
//console.log(tpl)
    while (match = REGEX.HTML_MARKUP.exec(tpl)) {

        if (lastTextPos > -1) {
            if (/*lastTextPos > -1 && */lastTextPos + match[0].length < REGEX.HTML_MARKUP.lastIndex) {
                // remove new line space
                let text = removeNLS(tpl.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                //const text = (data.substring(lastTextPos, REGEX.HTML_MARKUP.lastIndex - match[0].length));
                // if has content
                if (text) {
                    //console.log(text)
                    //let possibleCompiled = mapper.get(text.trim());
                    //text = placeholderIndex(text, values);
                    //if (!Array.isArray(text)) {
                        //console.log(currentParent)
                        if (currentParent.style === true) {
                            //console.log('currentParent.style', currentParent.style)
                            currentParent.style = text;
                            //console.log(currentParent)
                        } else {
                            if (text.substr(0, 5) === ' e-0_')
                                text = text.trim();
                            currentParent.appendChild(text);
                        }
                    /*} else {
                        currentParent.appendChild(text);
                    }*/
                }
            }
        }

        lastTextPos = REGEX.HTML_MARKUP.lastIndex;
        if (match[0][1] === '!') {
            // this is a comment or style
            continue;
        }
        // Gestisco anche tag chiusura vuoto: <${FooBar}>...</>
        if (match[0] === '</>') {
            let lastTag = last(stack).type;
            // assegno come tag l'ulitmo inserito in modo di avere una corrispondenza
            // <foo-bar>...</foo-bar>
            if (lastTag) {
                match[0] = `</${lastTag}>`;
                match[1] = '/';
                match[2] = lastTag;
            }
        }

        // exclude special text node
        if (regExcludeSpecial.test(match[0])) {
            continue;
        }

        // transform slot to dz-slot
        if (match[2] === 'slot')
            match[2] = TAG.SLOT;

        if (!match[1] && match[0]) {
            // not </ tags
            props = {};
            for (let attMatch; attMatch = REGEX.HTML_ATTRIBUTE.exec(match[3]);) {
                props[attMatch[2]] = attMatch[5] || attMatch[6] || '';
                //console.warn(props[attMatch[2]])
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

            /**/

            if (match[2] === 'style' && props['data-is-webcomponent'] === undefined) {
                currentParent.style = true;
                if (props['data-scoped'] === '') {
                    currentParent.styleScoped = true;
                }
                continue;
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

    if (root.style) {
        if (typeof root.children[0] === 'object') {
            //console.log('root.style', root.style)
            root.children[0].style = root.style;
            root.children[0].styleScoped = root.styleScoped;
        }
    }

    if (root.children.length > 1) {
        root.type = TAG.ROOT;
    } else if (root.children.length) {
        tplCache[tpl] = root.children[0];
        return root.children[0];
    }

    tplCache[tpl] = root;
    return root;
}

function serializeProps($node) {
    const props = {};

    if ($node._dozAttach[PROPS_ATTRIBUTES]) {
        let keys = Object.keys($node._dozAttach[PROPS_ATTRIBUTES]);
        for (let i = 0; i < keys.length; i++) {
            propsFixer($node.nodeName, keys[i], $node._dozAttach[PROPS_ATTRIBUTES][keys[i]], props, $node);
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

    //let isDirective = REGEX.IS_DIRECTIVE.test(aName);
    let _isDirective = isDirective(aName);

    //console.log('isDirective', isDirective, aName, aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':'));

    let propsName = REGEX.IS_CUSTOM_TAG.test(nName) && !_isDirective
        ? dashToCamel(aName)
        : aName;

    if ($node) {
        directive.callAppComponentPropsAssignName($node, aName, aValue, _isDirective, props, newPropsName => {
            propsName = newPropsName;
        });
    }
    /*
        if (typeof aValue === 'string' && !mapper.isValidId(aValue) && !isListener(aName)) {
            aValue = mapper.getAll(aValue);
        } else {
            let objValue = mapper.get(aValue);
            if (objValue !== undefined) {
                aValue = objValue;
            }
        }*/

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