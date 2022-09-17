module.exports = function toJSON (obj) {
    try {
        return JSON.parse(obj)
    } catch (e) {
        return obj;
    }
};