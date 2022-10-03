import index from "../../index.js";
const { directive } = index;
export default (function () {
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
            app._ids = {};
            app.getComponentById = function (id) {
                return app._ids[id];
            }
            /*Object.defineProperties(app, {
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
            });*/

        },
        onAppComponentCreate(instance) {
            instance.getComponentById = function (id) {
                return instance.app._ids[id];
            };

            instance.getCmp = instance.getComponentById;

            /*
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

             */
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
});
