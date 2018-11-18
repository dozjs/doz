function propsListener(instance, changes) {
    if (!instance.propsListener || typeof instance.propsListener !== 'object') return;

    for (let i = 0; i < changes.length; i++) {
        const item = changes[i];
        const propPath = instance.propsListener[item.currentPath];
        if (item.type === 'update' && propPath) {
            const func = instance[propPath];
            if (typeof func === 'function') {
                func.call(instance, item.newValue, item.previousValue);
            }
        }
    }
}

module.exports = propsListener;