module.exports = require('./doz');
module.exports.component = require('./component');
module.exports.collection = require('./collection');
module.exports.update = require('./vdom/index').updateElement;
module.exports.transform = require('./vdom/parser').transform;
module.exports.h = require('./vdom/h');
module.exports.html = require('./utils/html');
module.exports.version = '[AIV]{version}[/AIV]';