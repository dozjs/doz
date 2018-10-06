const html = require('../utils/html');
const {TAG} = require('../constants');
const {transform, serializeProps} = require('../vdom/parser');
const parser2 = require('../vdom/parser2');

function compile(template = '') {
    return parser2(template);
    /*template = template.trim();
    const tpl = html.create(template, TAG.ROOT);

    //console.log(parser2(template))
    //console.log(transform(tpl))

    return transform(tpl);*/
}

module.exports = compile;