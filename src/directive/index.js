const {registerDirective} = require('../collection');

function directive(name, options = {}) {
    registerDirective(name, options);
}

module.exports = Object.assign(
    {
        directive
    },
    require('./types/app'),
    require('./types/component'),
);