const {registerDirective} = require('../collection');

function directive(name, options = {}) {
    registerDirective(name, options);
}

module.exports = Object.assign(
    {
        directive
    },
    require('./system'),
    require('./component'),
    require('./dom')
);