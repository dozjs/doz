function mixin(obj, target) {
    if (typeof obj !== 'object' || obj == null) {
        throw new TypeError('expected an object');
    }

    let keys = Object.keys(obj);

    for (let i = keys.length - 1; i >= 0; --i) {
        let item = target[keys[i]];
        if(typeof item === 'function') {
            target[keys[i]] = item.bind(target);
        }
    }

    return target;
}

module.exports = bind;