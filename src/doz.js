const extend = require('defaulty');
const component = require('./component/index');

class Doz {

    constructor(cfg = {}) {

        if (!cfg.root instanceof HTMLElement) {
            throw new TypeError('root must be an HTMLElement');
        }

        if (!(cfg.template instanceof HTMLElement || typeof cfg.template === 'string')) {
            throw new TypeError('template must be a string or an HTMLElement');
        }

        this.cfg = extend(cfg, {
            components: [],
            _components: {}
        });

        this.cfg.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                this.cfg._components[cmp.tag] = cmp;
            }
        });

        this.cfg._components['doz-view-component'] = {
            cfg: {
                props: {},
                template() {
                    return cfg.template;
                }
            }
        };
        const template = `<doz-view-component></doz-view-component>`;

        this._usedComponents = component.getInstances(this.cfg.root, template, this.cfg._components) || [];

    }

    getComponent(alias) {
        return this._usedComponents[alias];
    }

}


module.exports = Doz;