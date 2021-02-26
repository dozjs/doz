const {directive} = require('../../index');

directive(':onbeforecreate', {
    onComponentBeforeCreate(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':oncreate', {
    onComponentCreate(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onbeforemount', {
    onComponentBeforeMount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onmount', {
    onComponentMount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onmountasync', {
    onComponentMountAsync(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onafterrender', {
    onComponentAfterRender(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance, changes);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onbeforeupdate', {
    onComponentBeforeUpdate(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance, changes);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onupdate', {
    onComponentUpdate(instance, changes, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance, changes);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance, changes);
        }
    }
});

directive(':onbeforeunmount', {
    onComponentBeforeUnmount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onunmount', {
    onComponentUnmount(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onbeforedestroy', {
    onComponentBeforeDestroy(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            return directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':ondestroy', {
    onComponentDestroy(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onloadprops', {
    onComponentLoadProps(instance, directiveValue) {
        if (typeof directiveValue === 'function') {
            directiveValue(instance);
        } else if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});