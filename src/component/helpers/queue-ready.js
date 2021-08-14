function add(instance) {
    //console.log('----->', instance.__proto__.constructor.__postListeners)
    if (typeof instance.onAppReady === 'function') {
        instance.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.onAppReady);
    } else if (instance.__proto__ &&
        instance.__proto__.constructor &&
        instance.__proto__.constructor.__postListeners &&
        instance.__proto__.constructor.__postListeners.onAppReady) {
        instance.__proto__.constructor.__postListeners.onAppReady._instance = instance;
        instance.app._onAppReadyCB.push(instance.__proto__.constructor.__postListeners.onAppReady);
    }
}

module.exports = {
    add
};