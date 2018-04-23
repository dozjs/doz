function create(instance) {

    if (typeof instance.id === 'string') {
        if (instance.view._ids[instance.id] !== undefined) {
            throw new Error(`ID already defined: ${instance.id}`);
        }
        instance.view._ids[instance.id] = instance;
    }
}

module.exports = {
    create
};