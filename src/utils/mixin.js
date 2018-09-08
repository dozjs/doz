function mixin(target, sources = []) {

    if (typeof target !== 'object' || target == null) {
        throw new TypeError('expected an object');
    }

    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    for (let j = sources.length - 1; j >= 0; --j) {
        let keys = Object.keys(sources[j]);
        for (let i = keys.length - 1; i >= 0; --i) {
            let index = keys[i];
            if (typeof target[index] === 'undefined') {
                target[index] = sources[j][index];
            }
        }
    }

    return target;
}

module.exports = mixin;