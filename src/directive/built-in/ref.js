const {directive} = require('../index');

directive('ref', {

    onSystemComponentCreate(instance) {
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