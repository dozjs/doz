export default function (context, _module) {
    if (!_module || !_module.hot) return;
    const ns = '__doz_hotStore__';

    window[ns] = window[ns] || {};
    const id = _module.id;
    window[ns][id] = window[ns][id] || new Map();

    Object.keys(context.props).forEach(p => {
        context.props[p] = window[ns][id].get(p) || context.props[p];
    });

    _module.hot.dispose(() => {
        Object.keys(context.props).forEach(p => {
            window[ns][id].set(p, context.props[p]);
        });
    });
}