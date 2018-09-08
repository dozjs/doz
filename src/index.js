const Doz = require('./Doz');

Doz.collection = require('./collection');
Doz.Component = require('./component/Component').Component;
Doz.component = require('./component');
Doz.define = Doz.component;
Doz.h = require('./vdom/h');
Doz.mixin = require('./component/global-mixin');
Doz.version = '[AIV]{version}[/AIV]';

module.exports = Doz;