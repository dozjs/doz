const {directive} = require('../../index');
const dashToCamel = require('../../../utils/dashToCamel');

module.exports = function() {
    directive('is', {

        hasDataIs($target) {
            return $target.dataset && $target.dataset.is;
        },

        onAppComponentAssignName(instance, $target) {
            if (this.hasDataIs($target))
                return $target.dataset.is;
        },

        onAppComponentPropsAssignName($target, propsName, isDirective) {
            if (this.hasDataIs($target))
                return dashToCamel(propsName);
            /*else
                return propsName;*/
        },

        onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
            $target.dataset.is = directiveValue;
            if (!initial)
                instance._processing.push({node: $target, action: 'create'});
        },

    });
}
