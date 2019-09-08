const {directive} = require('../index');

directive('ref', {

    onSystemComponentCreate(instance) {
        if (instance.ref === undefined)
            Object.defineProperties(instance, {
                ref: {
                    value: {},
                    writable: true,
                    enumerable: true
                }
            });
    },

    onDOMAttributeCreate(instance, $target, name, value, nodeProps) {
        instance.ref[value] = $target;
    }

});