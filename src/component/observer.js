const proxy = require('../proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');
const manipulate = require('./manipulate');

function runUpdate(instance, changes) {
    events.callUpdate(instance, changes);
    propsListener(instance, changes);
    instance.render();
    updateBoundElements(instance, changes);
}

function create(instance) {

    let recreate = false;

    if (instance._props && instance._props.__isProxy) {
        proxy.remove(instance._props);
        recreate = true;
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

    if (recreate && instance._isRendered) {
        console.log('recreate');
        instance.render();
    }
}

module.exports = {
    create
};