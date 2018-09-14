function add(instance) {
    if (typeof instance.onAppDraw === 'function') {
        instance.onAppDraw._instance = instance;
        instance.app._onAppDrawCB.push(instance.onAppDraw);
    }
}

function emit(instance, next, prev) {
    instance.app._onAppDrawCB.forEach(cb => {
        if (typeof cb === 'function' && cb._instance) {
            cb.call(cb._instance, next, prev, instance);
        }
    });
}

module.exports = {
    add,
    emit
};