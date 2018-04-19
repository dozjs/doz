const {PARSER} = require('../constants');
function canModel(el) {
    return ['INPUT', 'TEXTAREA'].indexOf(el.nodeName) !== -1
}

function getByPath(path, obj) {
    return path.split('.').reduce((res, prop) =>
        res
            ? res[prop]
            : {}
            , obj);
}

function getLastObjectByPath(path, obj) {
    if (path.indexOf('.') !== -1) {
        path = path.split('.');
        path.pop();
        path = path.join('.');
    }
    return getByPath(path, obj);
}

function createObjectMap(path, obj, value, overwrite = false) {
    return path.split('.').reduce((o, i, y, m) => {
        const isLast = m[m.length - 1] === i;
        if (isLast) {
            if (!overwrite && o.hasOwnProperty(i)) {
                if (!Array.isArray(o[i]))
                    o[i] = [o[i]];
                o[i].push(value)
            } else {
                o[i] = value;
            }
        } else if (!o.hasOwnProperty(i)) {
            o[i] = [];
        }
//console.log(i)
        return o[i]

    }, obj);
}

/**
 * Convert complex js object to dot notation js object
 * @link https://github.com/vardars/dotize
 * @author vardars
 * @param obj
 * @param prefix
 * @returns {*}
 */
function objectToPath(obj, prefix) {
    let newObj = {};

    if ((!obj || typeof obj !== 'object') && !Array.isArray(obj)) {
        if (prefix) {
            newObj[prefix] = obj;
            return newObj;
        } else {
            return obj;
        }
    }

    function isNumber(f) {
        return !isNaN(parseInt(f));
    }

    function isEmptyObj(obj) {
        for (let prop in obj) {
            if (Object.hasOwnProperty.call(obj, prop))
                return false;
        }
    }

    function getFieldName(field, prefix, isRoot, isArrayItem, isArray) {
        if (isArray)
            return (prefix ? prefix : '') + (isNumber(field) ? '[' + field + ']' : (isRoot ? '' : '.') + field);
        else if (isArrayItem)
            return (prefix ? prefix : '') + '[' + field + ']';
        else
            return (prefix ? prefix + '.' : '') + field;
    }

    return function recurse(o, p, isRoot) {
        let isArrayItem = Array.isArray(o);
        for (let f in o) {
            if (o.hasOwnProperty(f)) {
                let currentProp = o[f];
                if (currentProp && typeof currentProp === 'object') {
                    if (Array.isArray(currentProp)) {
                        newObj = recurse(currentProp, getFieldName(f, p, isRoot, false, true), isArrayItem); // array
                    } else {
                        if (isArrayItem && isEmptyObj(currentProp) === false) {
                            newObj = recurse(currentProp, getFieldName(f, p, isRoot, true)); // array item object
                        } else if (isEmptyObj(currentProp) === false) {
                            newObj = recurse(currentProp, getFieldName(f, p, isRoot)); // object
                        } else {
                            //
                        }
                    }
                } else {
                    if (isArrayItem || isNumber(f)) {
                        newObj[getFieldName(f, p, isRoot, true)] = currentProp; // array item primitive
                    } else {
                        newObj[getFieldName(f, p, isRoot)] = currentProp; // primitive
                    }
                }
            }
        }

        return newObj;
    }(obj, prefix, true);
}

function pathify(item) {
    if (typeof item.newValue === 'object') {
        return objectToPath(item.newValue, item.currentPath);
    } else {
        let res = {};
        res[item.currentPath] = item.newValue;
        return res;
    }
}

module.exports = {
    textToTag,
    tagToText,
    canModel,
    getNodeByPath: getByPath,
    getLastObjectByPath,
    objectToPath,
    pathify,
    createObjectMap
};