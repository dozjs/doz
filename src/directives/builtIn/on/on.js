import index from "../../index.js";
const { directive } = index;
export default (function () {
    directive(':on-$event', {
        onAppComponentCreate(instance) {
            instance._callback = {};
            instance.emit = function (name, ...args) {
                if (!instance._callback)
                    return;
                if (typeof instance._callback[name] === 'function') {
                    instance._callback[name].apply(instance.parent, args);
                    // legacy for string
                }
                else if (instance._callback[name] !== undefined
                    && instance.parent[instance._callback[name]] !== undefined
                    && typeof instance.parent[instance._callback[name]] === 'function') {
                    instance.parent[instance._callback[name]].apply(instance.parent, args);
                }
            }
            /*
            Object.defineProperties(instance, {
                _callback: {
                    value: {},
                    writable: true
                },
                emit: {
                    value: function (name, ...args) {
                        if (!instance._callback)
                            return;
                        if (typeof instance._callback[name] === 'function') {
                            instance._callback[name].apply(instance.parent, args);
                            // legacy for string
                        }
                        else if (instance._callback[name] !== undefined
                            && instance.parent[instance._callback[name]] !== undefined
                            && typeof instance.parent[instance._callback[name]] === 'function') {
                            instance.parent[instance._callback[name]].apply(instance.parent, args);
                        }
                    },
                    enumerable: true
                }
            });

             */
        },
        onComponentCreate(instance, directiveValue, keyArguments) {
            let source = {};
            source[keyArguments.event] = directiveValue;
            Object.assign(instance._callback, source);
        },
    });
});
