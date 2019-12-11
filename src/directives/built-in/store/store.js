const {directive} = require('../../index');

directive(':store', {

    createStore(instance, storeName) {
        if (typeof storeName === 'string') {
            if (instance.app._stores[storeName] !== undefined) {
                throw new Error(`Store already defined: ${storeName}`);
            }
            instance.app._stores[storeName] = instance.props;
            instance.store = storeName;
        }
    },

    syncStore(instance, storeName) {
        if (typeof storeName === 'string' && instance.app._stores[storeName] !== undefined) {
            instance.app._stores[storeName] = instance.props;
        }
    },

    onAppInit(app) {
        Object.defineProperties(app, {
            _stores: {
                value: {},
                writable: true
            },
            getStore: {
                value: function (store) {
                    return app._stores[store];
                },
                enumerable: true
            }
        });
    },

    // Create by property defined
    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            getStore: {
                value: function (store) {
                    return instance.app._stores[store];
                },
                enumerable: true
            }
        });

        if (instance.store !== undefined && instance.props['d:store'] === undefined) {
            this.createStore(instance, instance.store);
        }
    },

    // Create by props
    onComponentCreate(instance, directiveValue) {
        this.createStore(instance, directiveValue);
    },

    onAppComponentLoadProps(instance) {
        this.syncStore(instance, instance.store);
    },

    onAppComponentSetProps(instance) {
        this.syncStore(instance, instance.store);
    },

    onAppComponentSetConfig(instance, obj) {
        if (typeof obj.store === 'string') {
            this.createStore(instance, obj.store);
        }
    },

    onAppComponentDestroy(instance) {
        if (instance.store && instance.app._stores[instance.store])
            delete instance.app._stores[instance.store];
    },
});