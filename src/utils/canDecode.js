const html = require('./html');

function canDecode(str) {
    return /&\w+;/.test(str)
        ? html.decode(str)
        : str
}

module.exports = canDecode;