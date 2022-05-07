module.exports = function isJSON(obj) {
    return /^[{\[]/.test(obj);
};