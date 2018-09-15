const html = require('../utils/html');
const {transform} = require('../vdom/parser');
const {TAG} = require('../constants');

function compile(template = '') {
    template = template.trim();
    const tpl = html.create(template, TAG.ROOT);
    return transform(tpl);
}

module.exports = compile;