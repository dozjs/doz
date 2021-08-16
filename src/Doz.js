const bind = require('./utils/bind');
const createInstance = require('./component/create-instance');
const {TAG, REGEX, ALREADY_WALKED} = require('./constants');
const toLiteralString = require('./utils/to-literal-string');
const plugin = require('./plugin');
const directive = require('./directives');
const makeSureAttach = require('./component/make-sure-attach');
let appCounter = 12345;

class Doz {

    constructor(cfg = {}) {

        this.baseTemplate = `<${TAG.APP}></${TAG.APP}>`;

        if (REGEX.IS_ID_SELECTOR.test(cfg.root)) {
            cfg.root = document.getElementById(cfg.root.substring(1));
        }

        if (REGEX.IS_ID_SELECTOR.test(cfg.template)) {
            cfg.template = document.getElementById(cfg.template.substring(1));
            cfg.template = cfg.template.innerHTML;
        }

        if (!(cfg.root instanceof HTMLElement || cfg.root instanceof ShadowRoot)) {
            throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
        }

        if (!cfg.mainComponent && !(cfg.template instanceof HTMLElement || typeof cfg.template === 'string' || typeof cfg.template === 'function')) {
            throw new TypeError('template must be a string or an HTMLElement or a function or an valid ID selector like #example-template');
        }

        const appNode = document.querySelector(TAG.APP);

        // This fix double app rendering in SSR
        makeSureAttach(appNode);
        if (appNode && !appNode._dozAttach[ALREADY_WALKED]) {
            appNode.parentNode.removeChild(appNode);
        }

        this.cfg = Object.assign({}, {
            components: [],
            shared: {},
            useShadowRoot: false,
            propsListener: null,
            propsListenerAsync: null,
            listeners: null,
            actions: {},
            autoDraw: true,
            enableExternalTemplate: false
        }, cfg);

        Object.defineProperties(this, {
            _lastUId: {
                value: 0,
                writable: true
            },
            _components: {
                value: {},
                writable: true
            },
            _usedComponents: {
                value: {},
                writable: true
            },
            _cache: {
                value: new Map()
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
            _onAppDrawCB: {
                value: [],
                writable: true
            },
            _onAppCB: {
                value: {},
                writable: true
            },
            useShadowRoot: {
                value: this.cfg.useShadowRoot,
                writable: true,
                enumerable: true
            },
            _root: {
                value: this.cfg.root
            },
            appId: {
                value: window.DOZ_APP_ID || Math.random().toString(36).substring(2, 15),
                enumerable: true
            },
            appIntId: {
                value: appCounter++,
                enumerable: true
            },
            action: {
                value: bind(this.cfg.actions, this),
                enumerable: true
            },
            shared: {
                value: this.cfg.shared,
                writable: true,
                enumerable: true
            },
            cacheStores: {
                value: {
                    kCache: new Map(),
                    //tplCache: Object.create(null),
                    hCache: new Map()
                },
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

                    const contentStr = this.cfg.enableExternalTemplate ? eval('`' + toLiteralString(template) + '`') : template;
                    const autoCmp = {
                        tag: TAG.MOUNT,
                        cfg: {
                            props: {},
                            template(h) {
                                //return h`<${TAG.ROOT}>${contentStr}</${TAG.ROOT}>`;
                                return contentStr;
                            }
                        }
                    };

                    return createInstance({
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

        if (this.cfg.mainComponent) {
            this._tree = createInstance({
                mountMainComponent: true,
                root: this.cfg.root,
                component: this.cfg.mainComponent,
                app: this,
                innerHTML: this.cfg.innerHTML
            });// || [];

            //console.log(this._tree)
        } else {
            this._components[TAG.APP] = {
                tag: TAG.APP,
                cfg: {
                    template: typeof cfg.template === 'function' ? cfg.template : function () {
                        const contentStr = toLiteralString(cfg.template);
                        if (/\${.*?}/g.test(contentStr))
                            return eval('`' + contentStr + '`');
                        else
                            return contentStr;
                    }
                }
            };

            Object.keys(cfg).forEach(p => {
                if (!['template', 'root'].includes(p))
                    this._components[TAG.APP].cfg[p] = cfg[p];
            });

        }

        plugin.load(this);

        //Apply listeners
        if (this.cfg.listeners) {
            Object.keys(this.cfg.listeners).forEach(event => {
                //console.log(event)
                this.on(event, this.cfg.listeners[event])
            })
        }

        directive.callAppInit(this);

        if (!this.cfg.mainComponent && this.cfg.autoDraw)
            this.draw();

        this._callAppReady();
        this.emit('ready', this);
    }

    draw() {

        if (!this.cfg.autoDraw)
            this.cfg.root.innerHTML = '';
        this._tree = createInstance({
            root: this.cfg.root,
            template: this.baseTemplate,
            app: this
        });// || [];

        return this;
    }

    get mainComponent() {
        return this._tree;
    }

    on(event, callback) {
        if (typeof event !== 'string')
            throw new TypeError('Event must be a string');

        if (typeof callback !== 'function')
            throw new TypeError('Callback must be a function');

        if (!this._onAppCB[event]) {
            this._onAppCB[event] = [];
        }

        this._onAppCB[event].push(callback);

        return this;
    }

    emit(event, ...args) {
        if (this._onAppCB[event]) {
            this._onAppCB[event].forEach(func => {
                func.apply(this, args);
            });
        }

        return this;
    }

    generateUId() {
        return this.appId + '-' + (++this._lastUId);
    }
}

module.exports = Doz;