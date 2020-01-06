function dashToCamel(s) {
    if(s.indexOf('-') === -1) return s;
    return s.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

module.exports = dashToCamel;