module.exports = require('./doz');
module.exports.component = require('./component').component;
module.exports.collection = require('./collection');
module.exports.update = require('./vdom/index').updateElement;
module.exports.transform = require('./vdom/parser').transform;
module.exports.html = require('./utils/html');