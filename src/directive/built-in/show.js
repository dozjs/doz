const {directive} = require('../index');

directive('show', {

    setVisible($target, value) {
        $target.style.display = value === 'false' ? 'none' : '';
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        console.log('aaaa')
        this.setVisible($target, directiveValue);
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        console.log('bbbb')
        this.setVisible($target, directiveValue);
    }

});