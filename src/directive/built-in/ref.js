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

    /*onDOMAttributeCreate(instance, $target, name, value, nodeProps) {
        instance.ref[value] = $target;
    },*/

    onDOMElementCreate(instance, $target, directiveValue) {
        instance.ref[directiveValue] = $target;
    }

});