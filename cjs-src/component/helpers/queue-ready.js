function add(instance) {
    //console.log('----->', instance.__proto__.constructor.__postListeners)
    let instanceProto = instance.__proto__;
    if (typeof instance.onAppReady === 'function') {
        instance.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.onAppReady);
    } else if (instanceProto &&
        instanceProto.constructor &&
        instanceProto.constructor.__postListeners &&
        instanceProto.constructor.__postListeners.onAppReady) {
        instanceProto.constructor.__postListeners.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instanceProto.constructor.__postListeners.onAppReady);
    }
}

module.exports = {
    add
};