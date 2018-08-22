const {TAG} = require('../constants');
const tag = TAG.TEXT_NODE_PLACE;
const LESS = '<';
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
            if (char === LESS)
                allowTag = false;
            if (char === GREATER)
                allowTag = true;
        });

        if(allowTag)
            result += `<${tag}>${value[i]}</${tag}>${strings[i + 1]}`;
        else
            result += `${value[i]}${strings[i + 1]}`;
    }

    result = result
        .replace(regOpen, LESS)
        .replace(regClose, GREATER);

    return result;
};