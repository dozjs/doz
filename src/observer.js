/**
 * Observe object changes,
 * This new implementation trigger change only if is really changed and returns new value and old
 * @param object
 * @param onChange
 * @returns {*}
 * @link https://github.com/sindresorhus/on-change
 */
module.exports = (object, onChange) => {
    const handler = {
        get(target, property, receiver) {
            try {
                return new Proxy(target[property], handler);
            } catch (err) {
                return Reflect.get(target, property, receiver);
            }
        },
        defineProperty(target, property, descriptor) {
            const isNew = !target.hasOwnProperty(property);
            const current = target[property];
            const next = descriptor.value;
            console.log('ddddd')
            if(current !== next)
                onChange(next, current, isNew);
            return Reflect.defineProperty(target, property, descriptor);
        },
        deleteProperty(target, property) {
            onChange(undefined, target[property], false);
            return Reflect.deleteProperty(target, property);
        }
    };

    return new Proxy(object, handler);
};