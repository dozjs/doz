const proxy = require('../utils/proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');

function create(instance) {

    if (instance._props.__isProxy)
        proxy.remove(instance._props);

    // This converts the initial values
    if (typeof instance.propsConvert === 'object') {
        Object.keys(instance.propsConvert).forEach(currentPath => {
            let value = instance._rawProps[currentPath];
            if (value === undefined) return;
            const propPath = instance.propsConvert[currentPath];
            const func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                instance._rawProps[currentPath] = func.call(instance, value, null)
            }

        });
    }

    // This computes the initial values
    if (typeof instance.propsComputed === 'object') {
        Object.keys(instance.propsComputed).forEach(currentPath => {
            let value = instance._rawProps[currentPath];
            if (value === undefined) return;

            const cached = new Map();
            instance._computedCache.set(currentPath, cached);
            const propPath = instance.propsComputed[currentPath];
            const func = instance[propPath] || propPath;

            if (typeof func === 'function') {
                const result = func.call(instance, value, null);
                cached.set(value, result);
                instance._rawProps[currentPath] = result;
            }
        });
    }

    instance._props = proxy.create(instance._rawProps, null,
        changes => {
            if (!instance._isRendered) return;
            events.callUpdate(instance, changes);
            instance.render();
            propsListener(instance, changes);
            updateBoundElements(instance, changes);
        },
        (value, oldValue, currentPath) => {
            if (instance.propsConvert) {
                if (typeof instance.propsConvert === 'object') {
                    const propPath = instance.propsConvert[currentPath];
                    const func = instance[propPath] || propPath;
                    if (typeof func === 'function') {
                        return func.call(instance, value, oldValue)
                    }
                }
            }

            if (instance.propsComputed) {
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
                        const result = func.call(instance, value, oldValue);
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