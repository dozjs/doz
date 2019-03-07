function propsInitCheck(instance) {

    if (instance.propsInitCheck && typeof instance.propsInitCheck === 'object') {
        (function iterate(rawProps) {
            let keys = Object.keys(rawProps);
            for (let i = 0, l = keys.length; i < l; i++) {
                let property = keys[i];
                if (rawProps[property] instanceof Object && rawProps[property] !== null) {
                    iterate(rawProps[property])
                } else {
                    if (typeof instance.propsInitCheck[property] === 'function') {
                        rawProps[property] = instance.propsInitCheck[property].call(instance, rawProps[property]);
                    }
                }
            }
        })(instance._rawProps);
    }

}

module.exports = propsInitCheck;