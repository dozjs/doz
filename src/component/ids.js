function create(instance) {

    const id = instance.id;

    if (typeof id === 'string') {
        if (instance.app._ids[id] !== undefined) {
            throw new Error(`ID already defined: ${id}`);
        }
        instance.app._ids[id] = instance;
    }
}

module.exports = {
    create
};