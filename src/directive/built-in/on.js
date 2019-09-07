const {directive} = require('../index');

directive(':on-$event', {

    onSystemComponentCreate(instance) {
        Object.defineProperties(instance, {
            _callback: {
                value: {},
                writable: true
            },
            emit: {
                value: function (name, ...args) {
                    if (instance._callback && instance._callback[name] !== undefined
                        && instance.parent[instance._callback[name]] !== undefined
                        && typeof instance.parent[instance._callback[name]] === 'function') {
                        instance.parent[instance._callback[name]].apply(instance.parent, args);
                    }
                },
                enumerable: true
            }
        });
    },

    onComponentCreate(instance, directiveValue, keyArguments) {
        let source = {};
        source[keyArguments.event] = directiveValue;
        Object.assign(instance._callback, source);
    },

});