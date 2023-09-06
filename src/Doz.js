import bind from "./utils/bind.js";
import createInstance from "./component/createInstance.js";
import { TAG, REGEX, ALREADY_WALKED } from "./constants.js";
import toLiteralString from "./utils/toLiteralString.js";
import plugin from "./plugin/index.js";
import directive from "./directives/index.js";
import makeSureAttach from "./component/makeSureAttach.js";

let appCounter = 0;

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
        // if (cfg.root.hasChildNodes) {
        //     const appNode = cfg.root.firstElementChild; // document.querySelector(TAG.APP);
        //     // This fix double app rendering in SSR
        //     makeSureAttach(appNode);
        //     if (appNode && !appNode._dozAttach[ALREADY_WALKED]) {
        //         appNode.parentNode.removeChild(appNode);
        //     }
        // }

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
            createInstance: {
                value: createInstance
            },
            hydIdCounter: {
                value: 0,
                writable: true
            },
            hydIdUsedCounter: {
                value: 0,
                writable: true
            },
            hydMap: {
                value: new Map(),
                writable: true
            },
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
            _onAppComponentsMounted: {
                value: new Map(),
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
            hydration: {
                value: false,
                writable: true
            },
            isWebComponent: {
                value: this.cfg.isWebComponent
            },
            byAppCreate: {
                value: this.cfg.byAppCreate
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
            onAppEmit: {
                value: this.cfg.onAppEmit,
                writable: true,
                enumerable: true
            },
            shared: {
                value: this.cfg.shared,
                writable: true,
                enumerable: true
            },
            setAllAttributes: {
                value: this.cfg.setAllAttributes,
                writable: true,
                enumerable: true
            },
            onVdomUpdateElement: {
                value: this.cfg.onVdomUpdateElement,
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
                    //const contentStr = this.cfg.enableExternalTemplate ? eval('`' + toLiteralString(template) + '`') : template;
                    const autoCmp = {
                        tag: TAG.MOUNT,
                        cfg: {
                            props: {},
                            template(h) {
                                //return h`<${TAG.ROOT}>${contentStr}</${TAG.ROOT}>`;
                                return template;
                            }
                        }
                    };
                    return this.createInstance({
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

        if (cfg.root.hasChildNodes) {
            let  readDom = (element) => {
                // Check if the node is an element (not a text node)
                if (element && element.nodeType === 1) {
                    this.hydMap.set(this.hydIdCounter++, element);
                    // element.setAttribute('data-hyd', this.hydIdCounter);
                    // Traverse the element's children
                    const children = element.children;
                    for (let i = 0; i < children.length; i++) {
                        readDom(children[i]);
                    }
                }
            }
            readDom(cfg.root.firstElementChild);
            if (this.hydIdCounter)
                this.hydration = true;
        }

        if (Array.isArray(this.cfg.components)) {
            this.cfg.components.forEach(cmp => {
                if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                    this._components[cmp.tag] = cmp;
                }
            });
        }
        else if (typeof this.cfg.components === 'object') {
            Object.keys(this.cfg.components).forEach(objName => {
                this._components[objName] = {
                    tag: objName,
                    cfg: this.cfg.components[objName]
                };
            });
        }
        plugin.load(this);
        directive.callAppInit(this);
        if (this.cfg.mainComponent) {
            this._tree = this.createInstance({
                mountMainComponent: true,
                root: this.cfg.root,
                component: this.cfg.mainComponent,
                app: this,
                innerHTML: this.cfg.innerHTML
            }); // || [];
            //console.log(this._tree)
        }
        else {
            this._components[TAG.APP] = {
                tag: TAG.APP,
                cfg: {
                    template: typeof cfg.template === 'function' ? cfg.template : function () {
                        return cfg.template;
                        /*const contentStr = toLiteralString(cfg.template);
                        if (/\${.*?}/g.test(contentStr))
                            return eval('`' + contentStr + '`');
                        else
                            return contentStr;*/
                    }
                }
            };
            Object.keys(cfg).forEach(p => {
                if (!['template', 'root'].includes(p))
                    this._components[TAG.APP].cfg[p] = cfg[p];
            });
        }
        //Apply listeners
        if (this.cfg.listeners) {
            Object.keys(this.cfg.listeners).forEach(event => {
                //console.log(event)
                this.on(event, this.cfg.listeners[event]);
            });
        }
        if (!this.cfg.mainComponent && this.cfg.autoDraw)
            this.draw();
        this.canAppReady();
    }
    canAppReady() {
        if (this._onAppComponentsMounted.size) {
            setTimeout(() => {
                this.canAppReady();
            });
        }
        else {
            this._callAppReady();
            this.emit('ready', this);
        }
    }
    draw() {
        if (!this.cfg.autoDraw)
            this.cfg.root.innerHTML = '';
        this._tree = this.createInstance({
            root: this.cfg.root,
            template: this.baseTemplate,
            app: this
        }); // || [];
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
        if (this.onAppEmit) {
            this.onAppEmit(event, ...args);
        }
        return this;
    }
    generateUId() {
        return this.appId + '-' + (++this._lastUId);
    }
}
export default Doz;
