const proxy = require('../proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');
const manipulate = require('./manipulate');

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
        return manipulate(instance, value, currentPath, onFly);
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