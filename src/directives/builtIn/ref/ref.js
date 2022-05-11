const {directive} = require('../../index');

module.exports = function() {
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

        onComponentDOMElementCreate(instance, $target, directiveValue) {
            instance.ref[directiveValue] = $target;
        }

    });
}