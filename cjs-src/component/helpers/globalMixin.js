const Component = require('../Component');
const mixin = require('../../utils/mixin');

function globalMixin(obj) {
    mixin(Component.prototype, obj);
}

module.exports = globalMixin;