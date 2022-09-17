function bind(obj, context) {
    if (typeof obj !== 'object' || obj == null) {
        throw new TypeError('expected an object!');
    }
    let target = Object.assign({}, obj);
    let keys = Object.keys(obj);
    for (let i = keys.length - 1; i >= 0; --i) {
        let item = target[keys[i]];
        if (typeof item === 'function') {
            target[keys[i]] = item.bind(context);
        }
        else if (typeof item === 'object' && item != null) {
            target[keys[i]] = bind(item, context);
        }
    }
    return target;
}
export default bind;
