const {directive} = require('../index');

directive(':id', {

    createId(instance, id) {
        if (typeof id === 'string') {
            if (instance.app._ids[id] !== undefined) {
                throw new Error(`ID already defined: ${id}`);
            }
            instance.app._ids[id] = instance;
        }
    },

    onSystemAppInit(app) {
        Object.defineProperties(app, {
            _ids: {
                value: {},
                writable: true
            },
            getComponentById: {
                value: function (id) {
                    return app._ids[id];
                },
                enumerable: true
            }
        });
    },

    onSystemComponentCreate(instance) {
        Object.defineProperties(instance, {
            getComponentById: {
                value: function (id) {
                    return instance.app._ids[id];
                },
                enumerable: true
            },
            getCmp: {
                value: function (id) {
                    return instance.app._ids[id];
                },
                enumerable: true
            }
        });
        if (instance.id !== undefined) {
            this.createId(instance, instance.id);
        }
    },

    onSystemComponentSetConfig(instance, obj) {
        if (typeof obj.id === 'string') {
            instance.id = obj.id;
            this.createId(instance, instance.id);
        }
    },

    onComponentCreate(instance, directiveValue) {
        instance.id = directiveValue;
        this.createId(instance, instance.id);
    },
});