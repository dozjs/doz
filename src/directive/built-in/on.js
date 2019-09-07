const {directive} = require('../index');

directive(':on-$event', {

    /*createId(instance, id) {
        if (typeof id === 'string') {
            if (instance.app._ids[id] !== undefined) {
                throw new Error(`ID already defined: ${id}`);
            }
            instance.app._ids[id] = instance;
            instance.id = id;
        }
    },*/

    onSystemComponentCreate(instance) {
        Object.defineProperties(instance, {
            _callback: {
                value: {},
                writable: true
            },
            emit: {
                value: function (name, ...args) {
                    if (instance._callback && instance._callback[name] !== undefined
                        && instance.parent[instance._callback[name]] !== undefined
                        && typeof instance.parent[instance._callback[name]] === 'function') {
                        instance.parent[instance._callback[name]].apply(instance.parent, args);
                    }
                },
                enumerable: true
            }
        });
    },

    onComponentCreate(instance, directiveValue) {
        //this.createId(instance, directiveValue);
    },
/*
    onSystemComponentSetConfig(instance, obj) {
        if (typeof obj.id === 'string') {
            this.createId(instance, obj.id);
        }
    },

    onSystemComponentDestroy(instance) {
        if (instance.id && instance.app._ids[instance.id])
            delete instance.app._ids[instance.id];
    },*/
});