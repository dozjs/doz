const {directive} = require('../index');
const dashToCamel = require('../../utils/dash-to-camel');

directive('is', {

    hasDataIs($target) {
        return $target.dataset && $target.dataset.is;
    },

    onSystemComponentAssignName(instance, $target) {
        if (this.hasDataIs($target))
            return $target.dataset.is;
    },

    onSystemComponentPropsAssignName($target, propsName) {
        if (this.hasDataIs($target))
            return dashToCamel(propsName)
    },

    onDOMElementCreate(instance, $target, directiveValue, initial) {
        $target.dataset.is = directiveValue;
        if (!initial)
            instance._processing.push({node: $target, action: 'create'});
    },

});
