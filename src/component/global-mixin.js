const {Component} = require('./Component');
const mixin = require('../utils/mixin');

function globalMixin(obj) {
    if (!Array.isArray(obj))
        obj = [obj];

    mixin(Component.prototype, obj);
}

module.exports = globalMixin;