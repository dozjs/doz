import index from "../../index.js";
const { directive } = index;
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
