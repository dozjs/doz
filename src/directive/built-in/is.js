const {directive} = require('../index');
const DIR_IS = '__DOZ_D_IS__';

directive('is', {

    onSystemComponentAssignName(instance, $child) {
        if ($child.dataset && $child.dataset.is)
            return $child.dataset.is;
    },

    onDOMAttributeCreate(instance, $target, name, value, nodeProps) {
        $target.dataset.is = value;
        $target[DIR_IS] = true;
        instance._processing.push({node: $target, action: 'create'});
    }

});
