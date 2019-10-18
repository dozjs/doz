const {TAG} = require('../constants');
const camelToDash = require('../utils/camel-to-dash');
//const {compile} = require('../vdom/parser');
const tag = TAG.TEXT_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';

const regOpen = new RegExp(`<${tag}>(\\s+)?<`, 'gi');
const regClose = new RegExp(`>(\\s+)?<\/${tag}>`, 'gi');

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
            if (typeof value[i] === 'function' && strings[i].indexOf(LESSER) > -1) {
                let cmp = value[i];
                let tag = camelToDash(cmp.name);

                // if is a single word, rename with double word
                if (tag.indexOf('-') === -1) {
                    tag = `${tag}-${tag}`;
                }

                // add to local components
                if (this._components[tag] === undefined) {
                    this._components[tag] = {
                        tag,
                        cfg: cmp
                    };
                }
                value[i] = tag;
            }

            /*if (typeof value[i] === 'object') {
                let property = strings[i];
                property = property.replace(/[='"]/g, '');
                this.propsData[property] = value[i];
                //console.log(i, property, value[i]);
            }*/
        }

        if(allowTag)
            result += `<${tag}>${value[i]}</${tag}>${strings[i + 1]}`;
        else
            result += `${value[i]}${strings[i + 1]}`;
    }

    result = result
        .replace(regOpen, LESSER)
        .replace(regClose, GREATER);

    return result;
};