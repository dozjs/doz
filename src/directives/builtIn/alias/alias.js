import index from "../../index.js";
const { directive } = index;
export default (function () {
    directive(':alias', {
        createAlias(instance, alias) {
            if (typeof alias === 'string') {
                instance.alias = alias;
            }
        },
        onAppInit(app) {
            app.getComponent = function (alias) {
                //console.log(this._tree.children)
                return this._tree
                    ? this._tree.children[alias]
                    : undefined;
            };
            /*Object.defineProperties(app, {
                getComponent: {
                    value: function (alias) {
                        //console.log(this._tree.children)
                        return this._tree
                            ? this._tree.children[alias]
                            : undefined;
                    },
                    enumerable: true
                }
            });*/
        },
        onAppComponentCreate(instance) {
            instance.getComponent = function (alias) {
                return this.children
                    ? this.children[alias]
                    : undefined;
            }
            /*
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

             */
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
            return instance.alias ? instance.alias : n;
        }
    });
});
