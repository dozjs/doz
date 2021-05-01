const Doz = require('./Doz');

function mount(root, component, options) {
    console.log(root)
    let cfg = Object.assign({
        root,
        mainComponent: component
    }, options);

    return new Doz(cfg);
}

module.exports = mount;