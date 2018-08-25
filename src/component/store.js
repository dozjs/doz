function create(instance) {
    const storeName = instance.store;
    if (typeof storeName === 'string') {
        if (instance.app._stores[storeName] !== undefined) {
            throw new Error(`Store already defined: ${storeName}`);
        }
        instance.app._stores[storeName] = instance.props;
    }
}

module.exports = {
    create
};