const extend = require('defaulty');
const component = require('./component/index');
const {TAG, REGEX} = require('./constants');

class Doz {

    constructor(cfg = {}) {
        const template = `<${TAG.VIEW}></${TAG.VIEW}>`;

        if(REGEX.IS_ID_SELECTOR.test(cfg.root)) {
            cfg.root = document.getElementById(cfg.root.substring(1));
        }

        if(REGEX.IS_ID_SELECTOR.test(cfg.template)) {
            cfg.template = document.getElementById(cfg.template.substring(1));
            cfg.template = cfg.template.innerHTML;
        }

        if (!(cfg.root instanceof HTMLElement)) {
            throw new TypeError('root must be an HTMLElement or an valid ID selector like #example-root');
        }

        if (!(cfg.template instanceof HTMLElement || typeof cfg.template === 'string')) {
            throw new TypeError('template must be a string or an HTMLElement or an valid ID selector like #example-template');
        }

        this.cfg = extend(cfg, {
            components: []
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
            }
        });

        this.cfg.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                this._components[cmp.tag] = cmp;
            }
        });

        this._components[TAG.VIEW] = {
            cfg: {
                props: {},
                template() {
                    return cfg.template;
                }
            }
        };

        this._usedComponents = component.getInstances(this.cfg.root, template, this) || [];

    }

    getComponent(alias) {
        return this._usedComponents[0].children[alias];
    }

    getStore(store) {
        return this._stores[store];
    }

}


module.exports = Doz;