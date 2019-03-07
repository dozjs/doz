const manipulate = require('./manipulate');

function propsInit(instance) {

        (function iterate(props) {
            let keys = Object.keys(props);
            for (let i = 0, l = keys.length; i < l; i++) {
                let property = keys[i];
                if (props[property] instanceof Object && props[property] !== null) {
                    iterate(props[property])
                } else {
                    props[property] = manipulate(instance, props[property], property, false, true);
                }
            }
        })(instance._rawProps);

}

module.exports = propsInit;