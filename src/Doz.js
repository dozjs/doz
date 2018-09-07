const extend = require('./utils/extend');
const bind = require('./utils/bind');
const mixin = require('./utils/mixin');
const instances = require('./component/instances');
const {TAG, REGEX} = require('./constants');
const toLiteralString = require('./utils/to-literal-string');
const {Component} = require('./component/Component');

class Doz {

    constructor(cfg = {}) {
        const template = `<${TAG.APP}></${TAG.APP}>`;

        if (REGEX.IS_ID_SELECTOR.test(cfg.root)) {
            cfg.root = document.getElementById(cfg.root.substring(1));
        }

        if (REGEX.IS_ID_SELECTOR.test(cfg.template)) {
            cfg.template = document.getElementById(cfg.template.substring(1));
            cfg.template = cfg.template.innerHTML;
        }

        if (!(cfg.root instanceof HTMLElement)) {
            throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
        }

        if (!(cfg.template instanceof HTMLElement || typeof cfg.template === 'string' || typeof cfg.template === 'function')) {
            throw new TypeError('template must be a string or an HTMLElement or a function or an valid ID selector like #example-template');
        }

        // Remove if already exists
        const appNode = document.querySelector(TAG.APP);
        if (appNode) {
            appNode.parentNode.removeChild(appNode);
        }

        this.cfg = extend(cfg, {
            components: [],
            actions: {}
        });

        Object.defineProperties(this, {
            _components: {
                value: {},
                writable: true
            },
            _usedComponents: {
                value: {},
                writable: true
            },
            _stores: {
                value: {},
                writable: true
            },
            _cache: {
                value: new Map()
            },
            _ids: {
                value: {},
                writable: true
            },
            _onAppReadyCB: {
                value: [],
                writable: true
            },
            _callAppReady: {
                value: function () {
                    this._onAppReadyCB.forEach(cb => {
                        if (typeof cb === 'function' && cb._instance) {
                            cb.call(cb._instance);
                        }
                    });

                    this._onAppReadyCB = [];
                }
            },
            _root: {
                value: this.cfg.root
            },
            action: {
                value: bind(this.cfg.actions, this),
                enumerable: true
            },
            mount: {
                value: function (template, root, parent = this._tree) {

                    if (typeof root === 'string') {
                        root = document.querySelector(root);
                    }

                    root = root || parent._rootElement;

                    if (!(root instanceof HTMLElement)) {
                        throw new TypeError('root must be an HTMLElement or an valid selector like #example-root');
                    }

                    const contentStr = eval('`' + toLiteralString(template) + '`');
                    const autoCmp = {
                        tag: TAG.MOUNT,
                        cfg: {
                            props: {},
                            template() {
                                return `<${TAG.ROOT}>${contentStr}</${TAG.ROOT}>`;
                            }
                        }
                    };

                    return instances.get({
                        root,
                        template: `<${TAG.MOUNT}></${TAG.MOUNT}>`,
                        app: this,
                        parentCmp: parent,
                        autoCmp,
                        mount: true
                    });
                },
                enumerable: true
            }
        });

        if (Array.isArray(this.cfg.components)) {
            this.cfg.components.forEach(cmp => {
                if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                    this._components[cmp.tag] = cmp;
                }
            });
        } else if (typeof this.cfg.components === 'object') {
            Object.keys(this.cfg.components).forEach(objName => {
                this._components[objName] = {
                    tag: objName,
                    cfg: this.cfg.components[objName]
                }
            });
        }

        this._components[TAG.APP] = {
            tag: TAG.APP,
            cfg: {
                template: typeof cfg.template === 'function' ? cfg.template : function () {
                    const contentStr = toLiteralString(cfg.template);
                    return eval('`' + contentStr + '`');
                }
            }
        };

        Object.keys(cfg).forEach(p => {
            if (!['template', 'root'].includes(p))
                this._components[TAG.APP].cfg[p] = cfg[p];
        });

        this._tree = instances.get({root: this.cfg.root, template, app: this}) || [];
        this._callAppReady();
    }

    getComponent(alias) {
        return this._tree
            ? this._tree.children[alias]
            : undefined;
    }

    getComponentById(id) {
        return this._ids[id];
    }

    getStore(store) {
        return this._stores[store];
    }

    static mixin(obj) {
        if (!Array.isArray(obj))
            obj = [obj];

        mixin(Component.prototype, obj);
    }

}

module.exports = Doz;