const {directive} = require('../index');

directive('ref', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            ref: {
                value: {},
                writable: true,
                enumerable: true
            }
        });
    },

    onDOMElementCreate(instance, $target, directiveValue) {
        instance.ref[directiveValue] = $target;
    }

});