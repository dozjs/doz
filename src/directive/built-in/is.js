const {directive} = require('../index');
const DIR_IS = '__DOZ_D_IS__';

directive('is', {

    onSystemComponentAssignName(instance, $child) {
        if ($child.dataset && $child.dataset.is)
            return $child.dataset.is;
    },

    onSystemDOMElementCreate(instance, $target, node, initial) {
        if (node && node.props && node.props['d-is']) {
            $target.dataset.is = node.props['d-is'];
            $target[DIR_IS] = true;
            if (!initial)
            instance._processing.push({node: $target, action: 'create'});
        }
    }

});
