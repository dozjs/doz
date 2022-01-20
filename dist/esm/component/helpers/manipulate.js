import castType from "../../utils/cast-type.js";
function manipulate(instance, value, currentPath, onFly, init) {
    if (typeof instance.propsType === 'object') {
        const type = instance.propsType[currentPath];
        if (type !== undefined) {
            value = castType(value, type);
        }
    }
    if (init) {
        onFly = instance.propsConvertOnFly;
    }
    if (instance.propsConvert && instance.propsConvertOnFly === onFly) {
        if (typeof instance.propsConvert === 'object') {
            const propPath = instance.propsConvert[currentPath];
            const func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                return func.call(instance, value);
            }
        }
    }
    if (init) {
        onFly = instance.propsComputedOnFly;
    }
    if (instance.propsComputed && instance.propsComputedOnFly === onFly) {
        if (typeof instance.propsComputed === 'object') {
            let cached = instance._computedCache.get(currentPath);
            if (cached === undefined) {
                cached = new Map();
                instance._computedCache.set(currentPath, cached);
            }
            else {
                const cachedValue = cached.get(value);
                if (cachedValue !== undefined) {
                    return cachedValue;
                }
            }
            const propPath = instance.propsComputed[currentPath];
            const func = instance[propPath] || propPath;
            if (typeof func === 'function') {
                const result = func.call(instance, value);
                cached.set(value, result);
                return result;
            }
        }
    }
    return value;
}
export default manipulate;
