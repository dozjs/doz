const {directive} = require('../index');

function animate(node, animationName, callback) {
    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

directive('animate', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            animate: {
                value: animate,
                enumerable: true
            }
        });
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        console.log('directiveValue', directiveValue);
        instance.animate($target, directiveValue.enter)
    }

});