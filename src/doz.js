const extend = require('defaulty');
const component = require('./component');

class Doz {

    constructor(cfg = {}) {

        if (typeof cfg.el !== 'string') {
            throw new TypeError('el must be a string selector and is required');
        }

        this.cfg = extend.copy(cfg, {});

        this.dom = document.querySelector(this.cfg.el);
        this.components = component.getInstances(this.dom) || [];

        // Set initial defaultProps
        this.setProps();

    }

    setProps(props) {
        this.components.forEach(cmp => {
            component.setProps(props || {},  cmp.defaultProps, cmp.propsMap);
        })
    }

}


module.exports = Doz;