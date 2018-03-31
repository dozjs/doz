const extend = require('defaulty');
const {register} = require('./collection');

function Component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    const cmp = {};

    cmp.tag = tag;

    cmp.cfg = extend.copy(cfg, {
        data: {},
        tpl: '<div></div>'
    });

    register(cmp);
}

module.exports = Component;