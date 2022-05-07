const Doz = require('./Doz');

function appCreate(root, component, options) {

    let cfg = Object.assign({
        root,
        mainComponent: component,
        byAppCreate: true
    }, options);

    return new Doz(cfg);
}

module.exports = appCreate;