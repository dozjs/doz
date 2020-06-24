const {directive} = require('../../index');

directive(':id', {

    createId(instance, id) {
        if (typeof id === 'string') {
            /*if (instance.app._ids[id] !== undefined) {
                throw new Error(`ID already defined: ${id}`);
            }*/
            instance.app._ids[id] = instance;
            instance.id = id;
        }
    },

    onAppInit(app) {
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

    onAppComponentCreate(instance) {
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

        if (instance.id !== undefined && instance.props['d:id'] === undefined) {
            this.createId(instance, instance.id);
        }
    },

    onComponentCreate(instance, directiveValue) {
        this.createId(instance, directiveValue);
    },

    onAppComponentSetConfig(instance, obj) {
        if (typeof obj.id === 'string') {
            this.createId(instance, obj.id);
        }
    },

    onAppComponentDestroy(instance) {
        if (instance.id && instance.app._ids[instance.id])
            delete instance.app._ids[instance.id];
    },
});