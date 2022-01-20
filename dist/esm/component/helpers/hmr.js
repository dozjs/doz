function hmr(instance, _module) {
    if (!_module || !_module.hot)
        return;
    const NS_PROPS = '__doz_hmr_props_store__';
    const NS_INIT_PROPS = '__doz_hmr_init_props_store__';
    window[NS_PROPS] = window[NS_PROPS] || {};
    window[NS_INIT_PROPS] = window[NS_INIT_PROPS] || {};
    const id = _module.id;
    window[NS_PROPS][id] = window[NS_PROPS][id] || new Map();
    window[NS_INIT_PROPS][id] = window[NS_INIT_PROPS][id] || new Map();
    Object.keys(instance.props).forEach(p => {
        if (instance._initialProps[p] === window[NS_INIT_PROPS][id].get(p))
            instance.props[p] = window[NS_PROPS][id].get(p) || instance.props[p];
        else
            instance.props[p] = instance._initialProps[p];
    });
    _module.hot.dispose(() => {
        Object.keys(instance.props).forEach(p => {
            window[NS_PROPS][id].set(p, instance.props[p]);
            window[NS_INIT_PROPS][id].set(p, instance._initialProps[p]);
        });
    });
}
export default hmr;
