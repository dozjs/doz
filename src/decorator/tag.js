module.exports = function tag(name) {
    return function (target) {
        target.tag = name;
    }
};