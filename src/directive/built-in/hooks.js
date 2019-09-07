const {directive} = require('../index');

directive(':onbeforecreate', {
    onComponentBeforeCreate(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':oncreate', {
    onComponentCreate(instance, directiveValue) {
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});

directive(':onbeforemount', {
    onComponentBeforeMount(instance, directiveValue) {
        console.warn('3333')
        if (instance.parent && typeof instance.parent[directiveValue] === 'function') {
            return instance.parent[directiveValue].call(instance.parent, instance);
        }
    }
});