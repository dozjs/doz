const {TAG} = require('../constants');
const mapCompiled = require('./map-compiled');
const camelToDash = require('../utils/camel-to-dash');
const {compile} = require('../vdom/parser');
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
    let result = strings[0];
    let allowTag = false;

    for (let i = 0; i < value.length; ++i) {
        let dFunctionPlaceholder = '';
        if (Array.isArray(value[i])) {
            let newValueString = '';
            for (let j = 0; j < value[i].length; j++) {
                let obj = value[i][j];
                if(typeof obj === 'object' && obj.constructor && obj.constructor.name === 'Element') {
                    newValueString += `<${tagIterate}>${mapCompiled.set(obj)}</${tagIterate}>`;
                }
            }
            if (newValueString)
                value[i] = newValueString;
        }

        if(typeof value[i] === 'object' && value[i].constructor && value[i].constructor.name === 'Element') {
            value[i] = mapCompiled.set(value[i]);
        }

        [...strings[i]].forEach(char => {
            if (char === LESSER)
                allowTag = false;
            if (char === GREATER)
                allowTag = true;
        });

        if(/<\/?style( scoped)?>/ig.test(strings[i])) {
            allowTag = false;
        }

        // if this function is bound to Doz component
        if (this._components) {
            // if before is a <
            if (typeof value[i] === 'function' && value[i].__proto__.name === 'Component' && strings[i].indexOf(LESSER) > -1) {
                //console.log('---------------')
                let cmp = value[i];
                let tagCmp = camelToDash(cmp.name);

                // if is a single word, rename with double word
                if (tagCmp.indexOf('-') === -1) {
                    tagCmp = `${tagCmp}-${tagCmp}`;
                }

                // add to local components
                if (this._components[tagCmp] === undefined) {
                    this._components[tagCmp] = {
                        tagCmp,
                        cfg: cmp
                    };
                }
                value[i] = tagCmp;
            }

            if (typeof value[i] === 'object' || typeof value[i] === 'function') {

                let property = strings[i];
                if (!/</.test(property)) {
                    property = property.replace(/["'\s]+/g, '');
                    // Check if is an attribute
                    if (/^[\w-:]+=/.test(property)) {
                        //let isFunction = (typeof value[i] === 'function' || value[i] instanceof Date);
                        value[i] = mapCompiled.set(value[i]);
                        //if (isFunction) {
                            //dFunctionPlaceholder += `" d-function-${property}"${value[i]}`;
                        //}
                    }
                }
            }
        }

        if(allowTag)
            result += `<${tagText}>${value[i]}</${tagText}>${dFunctionPlaceholder}${strings[i + 1]}`;
        else
            result += `${value[i]}${dFunctionPlaceholder}${strings[i + 1]}`;
    }

    result = result
        .replace(regOpen, LESSER)
        .replace(regClose, GREATER);

    //console.log(result)

    result = compile(result);

    return result;
};