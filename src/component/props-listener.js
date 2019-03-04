const delay = require('../utils/delay');

function propsListener(instance, changes) {

    if (typeof instance.propsListener === 'object')
        for (let i = 0; i < changes.length; i++) {
            const item = changes[i];
            const propPath = instance.propsListener[item.currentPath];
            if (item.type === 'update' && propPath) {
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    func.call(instance, item.newValue, item.previousValue);
                }
            }
        }

    if (typeof instance.propsListenerAsync === 'object')
        for (let i = 0; i < changes.length; i++) {
            const item = changes[i];
            const propPath = instance.propsListenerAsync[item.currentPath];
            if (item.type === 'update' && propPath) {
                const func = instance[propPath] || propPath;
                if (typeof func === 'function') {
                    delay(func.call(instance, item.newValue, item.previousValue));
                }
            }
        }

}

module.exports = propsListener;