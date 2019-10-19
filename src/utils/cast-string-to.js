const isJSON = require('./is-json');
const isNumber = require('./is-number');
const toJSON = require('./to-json');
const toNumber = require('./to-number');
const typesMap = require('./types-map');

function castStringTo(obj) {

    //console.log('==>', typeof obj)

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