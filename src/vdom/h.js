const {TAG} = require('../constants');
const tag = TAG.TEXT_NODE_PLACE;

const regOpen = new RegExp(`<${tag}>(\\s+)?<`, 'gi');
const regClose = new RegExp(`>(\\s+)?<\/${tag}>`, 'gi');

module.exports = function (strings, ...value) {
    let result = strings[0];
    let allowTag = false;

    for (let i = 0; i < value.length; ++i) {
        Array.from(strings[i]).forEach(char => {
            if (char === '<')
                allowTag = false;
            if (char === '>')
                allowTag = true;
        });

        if(allowTag)
            result += `<${tag}>${value[i]}</${tag}>${strings[i + 1]}`;
        else
            result += `${value[i]}${strings[i + 1]}`;
    }

    result = result
        .replace(regOpen, '<')
        .replace(regClose, '>');

    return result;
};