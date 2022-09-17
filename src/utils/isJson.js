export default (function isJSON(obj) {
    return /^[{\[]/.test(obj);
});
