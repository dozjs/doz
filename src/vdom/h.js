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

    let Component = require('../component/Component');

    let result = strings[0];
    let allowTag = false;

    for (let i = 0; i < value.length; ++i) {
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

        if(/<\/?style( scoped)?>/ig.test(strings[i])) {
            allowTag = false;
        }

        // if this function is bound to Doz component
        if (this._components) {
            if (this._localComponentLastId === undefined) {
                this._localComponentLastId = 0;
            }

            if (this._componentsMap === undefined) {
                this._componentsMap = new Map();
            }
            // if before is a <
            if (typeof value[i] === 'function' && value[i].__proto__ === Component && strings[i].indexOf(LESSER) > -1) {
                let cmp = value[i];
                let tagCmp = camelToDash(cmp.name);
                // Sanitize tag name
                tagCmp = tagCmp.replace(/_+/, '');
                // if is a single word, rename with double word
                if (tagCmp.indexOf('-') === -1) {
                    tagCmp = `${tagCmp}-${tagCmp}`;
                }

                tagCmp += (this._localComponentLastId++);

                if (this._componentsMap.has(value[i])) {
                    tagCmp = this._componentsMap.get(value[i]);
                } else {
                    this._componentsMap.set(value[i], tagCmp);
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
        }

        //if (value[i] !== null && (typeof value[i] === 'object' || typeof value[i] === 'function')) {
            let property = strings[i];
        //console.log('--------', property, value[i] )
        let checkPoint = strings[i].trim();
        //console.log(checkPoint[checkPoint.length - 2])
        if (checkPoint.length > 2 && checkPoint[checkPoint.length - 2] === '=') {
            //if (!/<\/?/.test(property)) {
            //console.log(value[i])
            property = property.replace(/["'\s]+/g, '');
            // Check if is an attribute
            //if (/^[\w-:]+=/.test(property)) {
                value[i] = mapCompiled.set(value[i]);
            //}
            //}
            //}
        }
        //console.log('-------->', property, value[i] )
        if(allowTag)
            result += `<${tagText}>${value[i]}</${tagText}>${strings[i + 1]}`;
        else
            result += `${value[i]}${strings[i + 1]}`;
    }

    result = result
        .replace(regOpen, LESSER)
        .replace(regClose, GREATER);

    //console.log(result)

    result = compile(result);
    //console.log(result)
    return result;
};