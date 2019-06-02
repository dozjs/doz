const castStringTo = require('../utils/cast-string-to');
module.exports = function castType(name, value, cmp) {
    if (!cmp || cmp.propsType === undefined) {
        return castStringTo(value);
    } else {
        return value
    }
};