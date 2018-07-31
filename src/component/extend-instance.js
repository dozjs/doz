function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);

    // Add local components
    if (Array.isArray(cfg.components)) {
        cfg.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                instance._components[cmp.tag] = cmp;
            }
        });
        delete instance.components;
    } else if (typeof cfg.components === 'object'){
        Object.keys(cfg.components).forEach(objName => {
            instance._components[objName] = {
                tag: objName,
                cfg: cfg.components[objName]
            }
        });
        delete instance.components;
    }
}

module.exports = extendInstance;