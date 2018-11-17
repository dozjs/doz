const proxy = require('../utils/proxy');
const events = require('./hooks');
const updateBoundElements = require('./update-bound-element');
const propsListener = require('./props-listener');

function create(instance) {

    if(instance._props.__isProxy)
        proxy.remove(instance._props);

    instance._props = proxy.create(instance._rawProps, null, changes => {
        if(!instance._isRendered) return;
        events.callUpdate(instance, changes);
        instance.render();
        propsListener(instance, changes);
        updateBoundElements(instance, changes);
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