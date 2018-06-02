const _list = [];

/**
 * Simple deprecate
 * @param prop {*}
 * @param msg {string}
 * @returns {boolean}
 */
const deprecate = (prop, msg) => {
    if(typeof prop !== 'undefined') {
        msg = msg || prop;

        if(!_list.includes(msg))
            _list.push(msg);

        console.warn('[' + deprecate.title + ']', msg);
        return true;
    }
    return false;
};

deprecate.title = 'DeprecationWarning';

/**
 * Calls only once same deprecation
 * @param args
 * @returns {boolean}
 */
const once = (...args) => {
    if(_list.includes(args[1] || args[0]))
        return false;
    return deprecate.apply(this, args);
};

module.exports = deprecate;
module.exports.once = once;
module.exports._list = _list;