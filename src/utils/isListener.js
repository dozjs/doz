module.exports = function isListener(str) {
    if (typeof str !== 'string') return false;
    return str[0] === 'o' && str[1] === 'n';
};