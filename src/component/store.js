function create(instance) {

    if (typeof instance.store === 'string') {
        if (instance.view._stores[instance.store] !== undefined) {
            throw new Error(`Store already defined: ${instance.store}`);
        }
        instance.view._stores[instance.store] = instance.props;
    }
}

module.exports = {
    create
};