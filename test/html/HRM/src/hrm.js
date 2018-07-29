export default function (context, _module) {
    if (!_module || !_module.hot) return;
    window.__hotStore = window.__hotStore || new Map();

    Object.keys(context.props).forEach(p => {
        context.props[p] = window.__hotStore.get(p) || context.props[p];
    });

    _module.hot.dispose(() => {
        Object.keys(context.props).forEach(p => {
            window.__hotStore.set(p, context.props[p]);
        });
    });
}