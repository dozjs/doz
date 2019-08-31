const {directive} = require('../index');

directive(':store', {

    createStore(instance, storeName) {
        if (typeof storeName === 'string') {
            if (instance.app._stores[storeName] !== undefined) {
                throw new Error(`Store already defined: ${storeName}`);
            }
            instance.app._stores[storeName] = instance.props;
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

    onComponentCreateWithoutProps(instance) {
        Object.defineProperties(instance, {
            getStore: {
                value: function (store) {
                    return instance.app._stores[store];
                },
                enumerable: true
            }
        });
        if (instance.store !== undefined) {
            this.createStore(instance, instance.store);
        }
    },

    onComponentCreate(instance, directiveValue) {
        this.createStore(instance, directiveValue);
    },

    onComponentLoadProps(instance) {
        this.syncStore(instance, instance.store);
    },

    onComponentSetProps(instance) {
        this.syncStore(instance, instance.store);
    },

    onComponentSetConfig(instance, obj) {
        if (typeof obj.store === 'string') {
            instance.store = obj.store;
            this.createStore(instance, obj.store);
        }
    }
});