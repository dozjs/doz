function updateBoundElements(instance, changes) {
    changes.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(instance._boundElements, item.property)) {
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

module.exports = updateBoundElements;