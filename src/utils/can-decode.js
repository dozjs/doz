function canDecode(str) {
    return /&\w+;/.test(str)
        ? html.decode(str)
        : str
}

module.exports = canDecode;