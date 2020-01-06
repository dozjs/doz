const {REGEX} = require('../constants');
module.exports = function isCustomTag(tag) {
    return REGEX.IS_CUSTOM_TAG.test(tag)
};