const extend = require('defaulty');
const component = require('./component/index');

class Doz {

    constructor(cfg = {}) {

        /*if (typeof cfg.root !== 'string') {
            throw new TypeError('root must be a string selector and is required');
        }*/

        /*this.cfg = extend.copy(cfg, {
            template: '<div></div>'
        });*/

        this.cfg = Object.assign({}, cfg);

        //this.dom = document.querySelector(this.cfg.el);
        this.components = component.getInstances(this.cfg.root, this.cfg.template) || [];

        // Set initial defaultProps
        //this.setProps();

    }

    /*setProps(props) {
        this.components.forEach(cmp => {
            component.setProps(props || {},  cmp.defaultProps, cmp.propsMap);
        })
    }*/

}


module.exports = Doz;