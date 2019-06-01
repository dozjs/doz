const {REGEX} = require('../constants');

const test = {
    'undefined': undefined,
    'null': null,
    'NaN': NaN,
    'Infinity': Infinity,
    'true': true,
    'false': false,
    '0': 0
};

function castStringTo(obj) {

    if (typeof obj !== 'string') {
        return obj;
    }

    if (test.hasOwnProperty(obj)) {
        return test[obj];
        /*} else if (/^[{\[]/.test(obj)) {
            try {
                return JSON.parse(obj)
            } catch (e) {
            }*/
    } else if (REGEX.IS_OBJECT_OR_ARRAY.test(obj)) {
        try {
            return eval('var o; o=' + obj)
        } catch (e) {
        }
    } else if (/^0{2,}/.test(obj)) {
        return obj;
    } else if(/^[0-9]/.test(obj)) {
        const num = parseFloat(obj);
        if (!isNaN(num)) {
            if (isFinite(obj)) {
                if (obj.toLowerCase().indexOf('0x') === 0) {
                    return parseInt(obj, 16);
                }
                return num;
            }
        }
    }
    return obj;
}

module.exports = castStringTo;