const {directive} = require('../../index');

directive(':alias', {

    createAlias(instance, alias) {
        if (typeof alias === 'string') {
            instance.alias = alias;
        }
    },

    onAppInit(app) {
        Object.defineProperties(app, {
            getComponent: {
                value: function (alias) {
                    return this._tree
                        ? this._tree.children[alias]
                        : undefined;
                },
                enumerable: true
            }
        });
    },

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            getComponent: {
                value: function (alias) {
                    return this.children
                        ? this.children[alias]
                        : undefined;
                },
                enumerable: true
            }
        });
    },

    onComponentCreate(instance, directiveValue) {
        this.createAlias(instance, directiveValue);
    },

    onAppComponentSetConfig(instance, obj) {
        if (typeof obj.alias === 'string') {
            this.createAlias(instance, obj.alias);
        }
    },

    onAppComponentAssignIndex(instance, n) {
        return instance.alias ? instance.alias : n
    }
});