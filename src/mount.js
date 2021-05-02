const Doz = require('./Doz');

function mount(root, component, options) {
    let cfg = Object.assign({
        root,
        mainComponent: component
    }, options);

    return new Doz(cfg);
}

module.exports = mount;