export default (function isNumber(obj) {
    if (/^0{2,}/.test(obj))
        return false;
    return /^[0-9]/.test(obj);
});
