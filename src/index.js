module.exports = require('./Doz');
module.exports.component = require('./component');
module.exports.mixin = require('./component/global-mixin');
module.exports.define = module.exports.component;
module.exports.Component = require('./component/Component').Component;
module.exports.collection = require('./collection');
module.exports.h = require('./vdom/h');
module.exports.version = '[AIV]{version}[/AIV]';