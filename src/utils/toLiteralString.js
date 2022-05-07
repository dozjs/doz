function toLiteralString(str) {
    return str
        .replace(/{{/gm, '${')
        .replace(/}}/gm, '}');
}

module.exports = toLiteralString;