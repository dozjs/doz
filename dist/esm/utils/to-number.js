export default (function toNumber(obj) {
    const num = parseFloat(obj);
    if (!isNaN(num)) {
        if (isFinite(obj)) {
            if (obj.toLowerCase().indexOf('0x') === 0) {
                return parseInt(obj, 16);
            }
            return num;
        }
    }
    return obj;
});
