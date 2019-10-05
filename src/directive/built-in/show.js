const {directive} = require('../index');

directive('show', {

    setVisible($target, value) {
        $target.style.display = value === 'false' ? 'none' : 'initial';
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    }

});