function hmr (instance, _module) {
    if (!_module || !_module.hot) return;
    const ns = '__doz_hot_store__';

    window[ns] = window[ns] || {};
    const id = _module.id;
    window[ns][id] = window[ns][id] || new Map();

    Object.keys(instance.props).forEach(p => {
        instance.props[p] = window[ns][id].get(p) || instance.props[p];
    });

    _module.hot.dispose(() => {
        Object.keys(instance.props).forEach(p => {
            window[ns][id].set(p, instance.props[p]);
        });
    });
}

module.exports = hmr;