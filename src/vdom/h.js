const {TAG} = require('../constants');
//const mapper = require('./mapper');
const camelToDash = require('../utils/camel-to-dash');
const deepCopy = require('../utils/deep-copy');
//const eventsAttributes = require('../utils/events-attributes');
//const {scopedInner} = require('../component/helpers/style');
const {compile, Element} = require('../vdom/parser');
const tagText = TAG.TEXT_NODE_PLACE;
const hCache = new Map();
//const tagIterate = TAG.ITERATE_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';
const PLACEHOLDER_REGEX_GLOBAL = /e-0_(\d+)_0-e/g;
const PLACEHOLDER_REGEX = /e-0_(\d+)_0-e/;
/*
function _placeholderIndex(str, values) {
    let matched = /___{(\d+)}___/g.exec(str);
    //console.log(str, values)
    if (matched && matched[1] && values[matched[1]] !== undefined) {
        //console.log(str, values[matched[1]]);
        return values[matched[1]]
    } else
        return str;
}
*/
function placeholderIndex(str, values) {
    //console.log(str)
    if (typeof str !== 'string') {
        return str
    }

    if (str[0] === 'e' && str[1] === '-') {
        let match = PLACEHOLDER_REGEX.exec(str);
        //let match = /e-0_(\d+)_0-e/g.exec(str);
        //let match = str.match(PLACEHOLDER_REGEX);
        if (match) {
            // if is a possible text node
            if (match[1][0] === '0' && match[1].length >= 2) {
                // remove first fake 0 that identify a text node and cast to string every
                return values[match[1].substr(1)] + '';
            } else {
                return values[match[1]]
            }
        } else
            return str;
    } else {
        return str.replace(PLACEHOLDER_REGEX_GLOBAL, (match, p1) => {
            if (p1) {
                return values[p1];
            } else {
                return match;
            }
        })
    }
}

//const regOpen = new RegExp(`<${tagText}>(\\s+)?<`, 'gi');
//const regClose = new RegExp(`>(\\s+)?<\/${tagText}>`, 'gi');
//const regStyle = /<style(?: scoped)?>((?:.|\n)*?)<\/style>/gi;
/**/


/**
 * This method add special tag to value placeholder
 * @param strings
 * @param values
 * @returns {*}
 */
module.exports = function (strings, ...values) {

    //console.log(strings)
    //console.log(values)
    let tpl = hCache.get(strings);
    //let foundClonedCount = 0;

    //let cloned = hCache.get(values);
    //console.log(values.length);

    // Why? cycling require :D
    //let Component = require('../component/Component');

    if (!tpl) {
        tpl = strings[0];
        //et result2 = strings[0];
        let allowTag = false;
        let isInStyle = false;
        let thereIsStyle = false;
        //let isBoundedToComponent = !!this._components;
        //let compiled;

        let valueLength = values.length;
        for (let i = 0; i < valueLength; ++i) {
            //let isComponentConstructor = false;
            //if (Array.isArray(value[i])) {
            /*let newValueString = '';
            for (let j = 0; j < value[i].length; j++) {
                let obj = value[i][j];
                if(typeof obj === 'object' && obj.constructor && obj.constructor === Element) {
                    newValueString += `<${tagIterate}>${mapper.set(obj)}</${tagIterate}>`;
                }
            }
            if (newValueString) {
                value[i] = newValueString;
            }*/
            //}

            //if(value[i] !== null && typeof value[i] === 'object' && value[i].constructor && value[i].constructor === Element) {
            //value[i] = mapper.set(value[i]);
            //}

            let stringsI = strings[i];
            let stringLength = stringsI.length;
            for (let x = 0; x < stringLength; x++) {
                if (stringsI[x] === LESSER) {
                    allowTag = false;
                } else if (stringsI[x] === GREATER) {
                    allowTag = true;
                }
            }

            if (stringsI.indexOf('<style') > -1) {
                isInStyle = true;
                thereIsStyle = true;
            }

            if (stringsI.indexOf('</style') > -1) {
                isInStyle = false;
            }

            if (isInStyle) {
                allowTag = false;
                tpl = tpl
                    .replace(/ scoped>/, ' data-scoped>');
                //result2 = result;
            }

            //
            /*let isInHandler = false;
            // Check if value is a function and is after an event attribute like onclick for example.
            if (typeof values[i] === 'function' || typeof values[i] === 'object') {
                //for (let x = 0; x < eventsAttributes.length; x++) {
                let r = stringsI.split(`=`);
                if (['"', "'", ''].indexOf(r[r.length - 1]) > -1) {
                    isInHandler = true;
                }
                //}
            }*/

            //let attributeOriginalTagName;
            // if this function is bound to Doz component
            /*
            if (isBoundedToComponent && !isInStyle && !isInHandler) {

                // if before is to <
                if (values[i] && !Array.isArray(values[i]) && (typeof values[i] === 'function' || typeof values[i] === 'object') && strings[i].indexOf(LESSER) > -1) {
                    isComponentConstructor = true;
                    let cmp = values[i];
                    let tagName = camelToDash(cmp.tag || cmp.name || 'obj');
                    // Sanitize tag name
                    tagName = tagName.replace(/_+/, '');
                    // if is a single word, rename with double word
                    if (tagName.indexOf('-') === -1) {
                        tagName = `${tagName}-${tagName}`;
                    }

                    let tagCmp = tagName + '-' + this.uId + '-' + (this._localComponentLastId++);

                    if (this._componentsMap.has(values[i])) {
                        tagCmp = this._componentsMap.get(values[i]);
                    } else {
                        this._componentsMap.set(values[i], tagCmp);
                    }

                    // add to local components
                    if (this._components[tagCmp] === undefined) {
                        //attributeOriginalTagName = tagCmp;
                        this._components[tagCmp] = {
                            tag: tagName,
                            cfg: cmp
                        };
                    }

                    // add to local app components
                    if (this.app._components[tagCmp] === undefined) {
                        //attributeOriginalTagName = tagCmp;
                        this.app._components[tagCmp] = {
                            tag: tagName,
                            cfg: cmp
                        };
                    }

                    attributeOriginalTagName = tagCmp;
                    values[i] = tagName;
                }
            }
*/
            /*if ('string' === typeof values[i]) {
                if (/<.*>/.test(values[i]))
                    allowTag = false;
                console.log('allow', allowTag)
            }

            console.log(values[i])*/
            if (allowTag) {
                //result += `<${tagText}>${value[i]}</${tagText}>${strings[i + 1]}`;
                //if (Array.isArray(values[i])) {
                //if (typeof values[i] !== 'string') {
                if (typeof values[i] === 'object' || typeof values[i] === 'function') {
                    //console.log(values[i])
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                } else {
                    // possible html as string
                    if (/<.*>/.test(values[i])) {
                        tpl += `${values[i]}${strings[i + 1]}`;
                    } else {
                        // add a fake 0 before index useful to identify a text node so cast to string every
                        tpl += `<${tagText}>e-0_0${i}_0-e</${tagText}>${strings[i + 1]}`;
                    }
                }
            } else {
                // If is not component constructor then add to map.
                // Exclude string type and style also
                //if (!isInStyle && !isComponentConstructor && typeof value[i] !== 'string') {
                //value[i] = mapper.set(value[i]);
                //}
                /*if (attributeOriginalTagName) {
                    //result += `${value[i]} data-attributeoriginaletagname="${attributeOriginalTagName}" ${strings[i + 1]}`;
                    tpl += `e-0_${i}_0-e data-attributeoriginaletagname="${attributeOriginalTagName}" ${strings[i + 1]}`;
                } else {*/
                    //result += `${value[i]}${strings[i + 1]}`;
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                //}
            }
        }

        tpl = tpl.trim();
        hCache.set(strings, tpl);
        //console.log(strings)
    }
    //console.log(tpl)
    let cloned;
    let model = compile(tpl);
    let clonedKey;

    if (model.key !== undefined) {
        clonedKey = values.filter(item => typeof item !== 'function' && typeof item !== 'object').join('');
        cloned = clonedKey ? hCache.get(clonedKey) : undefined;
    }

    if (!cloned) {
        cloned = deepCopy(model);
        fillCompiled(cloned, values, null, this);
        if (clonedKey) {
            hCache.set(clonedKey, cloned);
        }
        //console.log(cloned, model)
    }
    // console.log(cloned)
    return cloned;
};

function fillCompiled(obj, values, parent, _this) {
    let keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        //for (let k in obj) {
        if (obj[keys[i]] && typeof obj[keys[i]] === 'object') {
            fillCompiled(obj[keys[i]], values, obj, _this);
        } else {
            //console.log(i, keys[i])
            let value = placeholderIndex(obj[keys[i]], values);

            //if (typeof value === 'function' && keys[i] === 'type') {
            if ('type' === keys[i] && 'string' !== typeof value) {

                let cmp = value;
                let tagName = camelToDash(cmp.tag || cmp.name || 'obj');
                // Sanitize tag name
                tagName = tagName.replace(/_+/, '');
                // if is a single word, rename with double word
                if (tagName.indexOf('-') === -1) {
                    tagName = `${tagName}-${tagName}`;
                }

                let tagCmp = tagName + '-' + _this.uId + '-' + (_this._localComponentLastId++);

                if (_this._componentsMap.has(value)) {
                    tagCmp = _this._componentsMap.get(value);
                } else {
                    _this._componentsMap.set(value, tagCmp);
                }

                // add to local components
                if (_this._components[tagCmp] === undefined) {
                    _this._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }

                // add to local app components
                if (_this.app._components[tagCmp] === undefined) {
                    _this.app._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }

                value = tagName;
                obj.props['data-attributeoriginaletagname'] = tagCmp;

            }
            if (Array.isArray(value) && keys[i] === '0') {
                parent.children = value;
                if (value[0] && value[0].key !== undefined)
                    parent.hasKeys = true;
            } else
                obj[keys[i]] = value;
        }
    }
}
