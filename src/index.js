const Doz = require('./Doz');
const _component = require('./component');

Object.defineProperties(Doz, {
   collection: {
       value: require('./collection'),
       enumerable: true
   },
   Component: {
       value: require('./component/Component').Component,
       enumerable: true
   },
   component: {
       value: _component,
       enumerable: true
   },
   define: {
       value: _component,
       enumerable: true
   },
   h: {
       value: require('./vdom/h'),
       enumerable: true
   },
   mixin: {
       value: require('./component/global-mixin'),
       enumerable: true
   },
   version: {
       value: '[AIV]{version}[/AIV]',
       enumerable: true
   }
});

module.exports = Doz;