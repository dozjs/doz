const proxy = require('../utils/proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');

function create(instance) {

    if (instance._props.__isProxy)
        proxy.remove(instance._props);

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
                    if (instance._computedCache.has(currentPath))
                        return instance._computedCache.get(currentPath);
                    const propPath = instance.propsComputed[currentPath];
                    const func = instance[propPath] || propPath;
                    if (typeof func === 'function') {
                        const result = func.call(instance, value, oldValue);
                        instance._computedCache.set(currentPath, result);
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