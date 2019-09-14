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
            console.log('________', $target.nodeName, $target[DIR_IS]);
            if (!initial)
            instance._processing.push({node: $target, action: 'create'});
        }
    },
/*
    onDOMElementCreate(instance, $target, directiveValue, initial) {
        $target.dataset.is = directiveValue;
        $target[DIR_IS] = true;
        console.log('____', $target.nodeName, $target[DIR_IS]);
        if (!initial)
            instance._processing.push({node: $target, action: 'create'});
    },
*/
    onSystemDOMAttributeSet(instance, $target, attributeName, attributeValue) {
        console.log('xxxxxxxx', $target.nodeName, $target[DIR_IS]);
        //console.log('bbbbbbbbbbbbbbbbbbbb', attributeName, attributeValue)
        /*$target.dataset.is = directiveValue;
        $target[DIR_IS] = true;
        if (!initial)
            instance._processing.push({node: $target, action: 'create'});*/
    }

});
