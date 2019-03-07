const proxy = require('../proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');

function runUpdate(instance, changes) {
    events.callUpdate(instance, changes);
    instance.render();
    propsListener(instance, changes);
    updateBoundElements(instance, changes);
}

function create(instance, initial = false) {

    if (instance._props && instance._props.__isProxy) {
        proxy.remove(instance._props);
    }

    //console.log(instance.tag, instance._rawProps, initial);

    if (/*!instance.__initChecked &&*/ instance.propsInitCheck && typeof instance.propsInitCheck === 'object') {
        //instance.__initChecked = true;
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

    instance._props = proxy.create(instance._rawProps, null,
        changes => {
            if (!instance._isRendered) return;

            if (instance.delayUpdate) {
                setTimeout(() => {
                    runUpdate(instance, changes);
                }, instance.delayUpdate);
            } else {
                runUpdate(instance, changes);
            }
        });

    proxy.manipulate(instance._props, (value, currentPath, onFly) => {
        if (instance.propsConvert && instance.propsConvertOnFly === onFly) {
            if (typeof instance.propsConvert === 'object') {
                const propPath = instance.propsConvert[currentPath];
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    return func.call(instance, value)
                }
            }
        }

        if (instance.propsComputed && instance.propsComputedOnFly === onFly) {
            if (typeof instance.propsComputed === 'object') {
                let cached = instance._computedCache.get(currentPath);
                if (cached === undefined) {
                    cached = new Map();
                    instance._computedCache.set(currentPath, cached);
                } else {
                    const cachedValue = cached.get(value);
                    if (cachedValue !== undefined) {
                        return cachedValue;
                    }
                }
                const propPath = instance.propsComputed[currentPath];
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    const result = func.call(instance, value);
                    cached.set(value, result);
                    return result;
                }
            }
        }

        return value;
    });

    proxy.beforeChange(instance._props, changes => {
        const res = events.callBeforeUpdate(instance, changes);
        if (res === false)
            return false;
    });
}

module.exports = {
    create
};