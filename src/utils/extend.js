/**
 * Copies deep missing properties to the target object
 * @param targetObj {Object} target object
 * @param defaultObj {Object} default object
 * @param exclude {Array} exclude properties from copy
 * @returns {*}
 */

function extend(targetObj, defaultObj, exclude = []) {
    for (let i in defaultObj) {
        /* istanbul ignore else  */
        if (defaultObj.hasOwnProperty(i) && exclude.indexOf(i) === -1) {
            if (!targetObj.hasOwnProperty(i) || typeof targetObj[i] === 'undefined') {
                targetObj[i] = defaultObj[i];
            } else if (typeof targetObj[i] === 'object') {
                extend(targetObj[i], defaultObj[i]);
            }
        }
    }
    return targetObj;
}

/**
 * Creates new target object and copies deep missing properties to the target object
 * @param args[0]] {Object} target object
 * @param args[1]] {Object} default object
 * @param args[2]] {Array} exclude properties from copy
 * @returns {*}
 */
function copy(...args) {
    args[0] = Object.assign({}, args[0]);
    return extend.apply(this, args);
}

module.exports = extend;
module.exports.copy = copy;