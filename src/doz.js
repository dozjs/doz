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
            components: {}
        });

        this.cfg.components['doz-view-component'] = {};
        this.cfg.template = `<doz-view-component>${this.cfg.template}</doz-view-component>`;

        this._usedComponents = component.getInstances(this.cfg.root, this.cfg.template, this.cfg.components) || [];

    }

    getComponent(alias) {
        return this._usedComponents[alias];
    }

}


module.exports = Doz;