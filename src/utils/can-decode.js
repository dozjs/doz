const html = require('./html');

function canDecode(str) {
    //console.log(str);
    //return /&\w+;/.test(str)
    return str.indexOf('&') > -1
        ? html.decode(str)
        : str
}

module.exports = canDecode;