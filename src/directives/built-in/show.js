const {directive} = require('../index');

directive('show', {

    setVisible($target, value) {
        $target.style.display = value === false ? 'none' : '';
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    }

});