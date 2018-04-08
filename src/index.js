module.exports = require('./doz');
module.exports.component = require('./component/index').component;
module.exports.collection = require('./collection');
module.exports.update = require('./virtual-dom').updateElement;
module.exports.transform = require('./parser').transform;
module.exports.html = require('./html');