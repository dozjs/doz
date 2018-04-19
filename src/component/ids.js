function create(instance) {

    if (typeof instance.id === 'string') {
        if (instance._view._ids[instance.id] !== undefined) {
            throw new Error(`ID already defined: ${instance.id}`);
        }
        instance._view._ids[instance.id] = instance;
    }
}

module.exports = {
    create
};