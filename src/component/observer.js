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

function create(instance) {

    if (instance._props.__isProxy)
        proxy.remove(instance._props);

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