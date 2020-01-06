const {registerComponent} = require('../collection');
const isCustomTag = require('../utils/is-custom-tag');

function component(tag, cfg = {}) {

    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }

    if (!isCustomTag(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }

    const cmp = {
        tag,
        cfg
    };

    registerComponent(cmp);
}

module.exports = component;