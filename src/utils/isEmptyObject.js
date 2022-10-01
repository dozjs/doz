export default (function isEmptyObject(obj) {
    for(let i in obj) return false;
    return true;
})