function create(instance) {

    if (typeof instance.store === 'string') {
        if (instance.app._stores[instance.store] !== undefined) {
            throw new Error(`Store already defined: ${instance.store}`);
        }
        instance.app._stores[instance.store] = instance.props;
    }
}

module.exports = {
    create
};