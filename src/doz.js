const extend = require('./utils/extend');
const bind = require('./utils/bind');
const component = require('./component/index');
const {TAG, REGEX} = require('./constants');

class Doz {

    constructor(cfg = {}) {
        const template = `<${TAG.VIEW}></${TAG.VIEW}>`;

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

                    const autoCmp = {
                        tag: TAG.ROOT,
                        cfg: {
                            props: {},
                            template() {
                                return template;
                            }
                        }
                    };

                    return component.getInstances({
                        root,
                        template: `<${TAG.ROOT}></${TAG.ROOT}>`,
                        view: this,
                        parentCmp: parent,
                        //isStatic: false,
                        autoCmp,
                        mount: true
                    });
                },
                enumerable: true
            }
        });

        this.cfg.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                this._components[cmp.tag] = cmp;
            }
        });

        this._components[TAG.VIEW] = {
            tag: TAG.VIEW,
            cfg: {
                props: cfg.props || {},
                template() {
                    return typeof cfg.template === 'function' ? cfg.template() : cfg.template;
                }
            }
        };

        this._tree = component.getInstances({root: this.cfg.root, template, view: this}) || [];
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

}

module.exports = Doz;