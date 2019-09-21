const {directive} = require('../index');

const ATTR_KEY = 'd-key';

directive('key', {

    onAppComponentCreate(instance) {
        /*Object.defineProperties(instance, {
            _dynamicNodes: {
                value: {},
                writable: true
            }
        });*/
    },

    onAppComponentPropsAssignName($target, propName, propValue, isDirective, props) {
        //if (isDirective)
        //console.log('propsName', propsName)
        if (propName === ATTR_KEY) {
            props.dataKey = propValue;
            return 'data-key';
        }
    },

    /*onComponentElementCreate(instance, $target, directiveValue) {
        instance.ref[directiveValue] = $target;
    }*/

});