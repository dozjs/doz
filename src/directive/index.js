const {registerDirective} = require('../collection');

function directive(name, options = {}) {
    registerDirective(name, options);
}

module.exports = Object.assign(
    {
        directive
    },
    require('./types/system'),
    require('./types/component'),
    require('./types/dom')
);