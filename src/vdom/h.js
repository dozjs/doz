const {TAG} = require('../constants');
const mapCompiled = require('./map-compiled');
const camelToDash = require('../utils/camel-to-dash');
const {compile, Element} = require('../vdom/parser');
const tagText = TAG.TEXT_NODE_PLACE;
const tagIterate = TAG.ITERATE_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';

const regOpen = new RegExp(`<${tagText}>(\\s+)?<`, 'gi');
const regClose = new RegExp(`>(\\s+)?<\/${tagText}>`, 'gi');

/**
 * This method add special tag to value placeholder
 * @param strings
 * @param value
 * @returns {*}
 */
module.exports = function (strings, ...value) {

    //hCache.get(strings, value);
    //console.log('val', value);

    // Why? cycling require :D
    //let Component = require('../component/Component');

    let result = strings[0];
    let allowTag = false;
    let isInStyle = false;

    for (let i = 0; i < value.length; ++i) {
        let isComponentConstructor = false;
        if (Array.isArray(value[i])) {
            let newValueString = '';
            for (let j = 0; j < value[i].length; j++) {
                let obj = value[i][j];
                if(typeof obj === 'object' && obj.constructor && obj.constructor === Element) {
                    newValueString += `<${tagIterate}>${mapCompiled.set(obj)}</${tagIterate}>`;
                }
            }
            if (newValueString)
                value[i] = newValueString;
        }

        if(value[i] !== null && typeof value[i] === 'object' && value[i].constructor && value[i].constructor === Element) {
            value[i] = mapCompiled.set(value[i]);
        }


        [...strings[i]].forEach(char => {
            if (char === LESSER)
                allowTag = false;
            if (char === GREATER)
                allowTag = true;
        });


        if (strings[i].indexOf('<style') > -1) {
            isInStyle = true;
        }

        if (strings[i].indexOf('</style') > -1) {
            isInStyle = false;
        }

        if(isInStyle) {
            allowTag = false;
        }

        // if this function is bound to Doz component
        if (this._components) {

            // if before is to <
            if (typeof value[i] === 'function' /*&& value[i].__proto__ === Component*/ && strings[i].indexOf(LESSER) > -1) {
                isComponentConstructor = true;
                let cmp = value[i];
                let tagCmp = camelToDash(cmp.name);
                // Sanitize tag name
                tagCmp = tagCmp.replace(/_+/, '');
                // if is a single word, rename with double word
                /*if (tagCmp.indexOf('-') === -1) {
                    tagCmp = `${tagCmp}-${tagCmp}`;
                }*/

                tagCmp += '-' + this.uId + '-' + (this._localComponentLastId++);

                if (this._componentsMap.has(value[i])) {
                    tagCmp = this._componentsMap.get(value[i]);
                } else {
                    this._componentsMap.set(value[i], tagCmp);
                }

                // add to local components
                if (this._components[tagCmp] === undefined) {
                    this._components[tagCmp] = {
                        tag: tagCmp,
                        cfg: cmp
                    };
                }

                // add to local app components
                if (this.app._components[tagCmp] === undefined) {
                    this.app._components[tagCmp] = {
                        tag: tagCmp,
                        cfg: cmp
                    };
                }

                value[i] = tagCmp;
            }
        }

        if(allowTag)
            result += `<${tagText}>${value[i]}</${tagText}>${strings[i + 1]}`;
        else {
            // If is not component constructor then add to map.
            // Exclude string type also
            if(!isComponentConstructor && typeof value[i] !== 'string') {
                value[i] = mapCompiled.set(value[i]);
            }
            result += `${value[i]}${strings[i + 1]}`;
        }
    }

    result = result
        .replace(regOpen, LESSER)
        .replace(regClose, GREATER);

    //console.log(result);

    result = compile(result);

    //hCache.set(strings, value, result);
    //console.log(result)
    //console.log(mapCompiled.data)
    return result;
};