const isJSON = require('./isJson');
const isNumber = require('./isNumber');
const toJSON = require('./toJson');
const toNumber = require('./toNumber');
const typesMap = require('./typesMap');

function castStringTo(obj) {
//return obj;
    if (typeof obj !== 'string') {
        return obj;
    }

    if (typesMap.hasOwnProperty(obj)) {
        return typesMap[obj];
    } else if (isJSON(obj)) {
        return toJSON(obj)
    } else if (isNumber(obj)) {
        return toNumber(obj);
    }

    return obj;

}

module.exports = castStringTo;