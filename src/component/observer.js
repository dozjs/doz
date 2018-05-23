const proxy = require('../utils/proxy');
const events = require('./events');
const delay = require('../utils/delay');

function updateBound(instance, changes) {
    changes.forEach(item => {
        if (instance._boundElements.hasOwnProperty(item.property)) {
            instance._boundElements[item.property].forEach(element => {
                if (element.type === 'checkbox') {
                    if(!element.defaultValue)
                        element.checked = item.newValue;
                    else if (Array.isArray(item.newValue)) {
                        const inputs = document.querySelectorAll(`input[name=${element.name}][type=checkbox]`);
                        [...inputs].forEach(input => input.checked = item.newValue.includes(input.value));
                    }
                } else if (element.type === 'radio') {
                    element.checked = element.value === item.newValue;
                } else if(element.type === 'select-multiple' && Array.isArray(item.newValue)) {
                    [...element.options].forEach(option => option.selected = item.newValue.includes(option.value));
                } else {
                    element.value = item.newValue;
                }

            })
        }
    });
}

function create(instance, props) {
    instance.props = proxy.create(props, true, changes => {
        instance.render();
        updateBound(instance, changes);
        if (instance._isCreated) {
            delay(() => {
                //updateChildren(instance, changes);
                events.callUpdate(instance, changes);
            });
        }
    });

    proxy.beforeChange(instance.props, changes => {
        const res = events.callBeforeUpdate(instance, changes);
        if (res === false)
            return false;
    });
}

module.exports = {
    create
};