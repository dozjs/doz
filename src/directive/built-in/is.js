const {directive} = require('../index');
const dashToCamel = require('../../utils/dash-to-camel');
const DIR_IS = '__DOZ_D_IS__';

directive('is', {

    onSystemComponentAssignName(instance, $child) {
        if ($child.dataset && $child.dataset.is)
            return $child.dataset.is;
    },

    onSystemComponentPropsAssignName($target, propsName) {
        if ($target[DIR_IS])
            return dashToCamel(propsName)
    },

    onDOMElementCreate(instance, $target, directiveValue, initial) {
        $target.dataset.is = directiveValue;
        $target[DIR_IS] = true;
        if (!initial)
            instance._processing.push({node: $target, action: 'create'});
    },

});
