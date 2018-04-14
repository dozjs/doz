function create(instance, props) {
    console.log(props);

    if (typeof instance.store === 'string') {
        if (instance._view._stores.hasOwnProperty(instance.store)) {
            throw new Error(`Store already defined: ${instance.store}`);
        }
        instance._view._stores[instance.store] = instance.props;
    }
}

module.exports = {
    create
};