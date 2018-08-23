function loadLocal(instance) {

    // Add local components
    if (Array.isArray(instance.components)) {
        instance.components.forEach(cmp => {
            if (typeof cmp === 'object' && typeof cmp.tag === 'string' && typeof cmp.cfg === 'object') {
                instance._components[cmp.tag] = cmp;
            }
        });
        delete instance.components;
    } else if (typeof instance.components === 'object'){
        Object.keys(instance.components).forEach(objName => {
            instance._components[objName] = {
                tag: objName,
                cfg: instance.components[objName]
            }
        });
        delete instance.components;
    }
}

module.exports = loadLocal;