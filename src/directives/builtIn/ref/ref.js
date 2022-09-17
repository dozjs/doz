import index from "../../index.js";
const { directive } = index;
export default (function () {
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
});
