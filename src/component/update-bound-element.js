function updateBoundElementsByChanges(instance, changes) {
    changes.forEach(item => {
        let value = item.newValue;
        let property = item.property;
        updateBoundElements(instance, value, property);
    });
}

function updateBoundElementsByPropsIteration(instance) {
    (function iterate(props) {
        let keys = Object.keys(props);
        for (let i = 0, l = keys.length; i < l; i++) {
            let property = keys[i];
            if (props[property] instanceof Object && props[property] !== null) {
                iterate(props[property])
            } else {
                updateBoundElements(instance, props[property], property);
            }
        }
    })(instance._rawProps);
}

function updateBoundElements(instance, value, property) {
    if (Object.prototype.hasOwnProperty.call(instance._boundElements, property)) {
        instance._boundElements[property].forEach(element => {
            if (element.type === 'checkbox') {
                if(!element.defaultValue)
                    element.checked = value;
                else if (Array.isArray(value)) {
                    const inputs = document.querySelectorAll(`input[name=${element.name}][type=checkbox]`);
                    [...inputs].forEach(input => input.checked = value.includes(input.value));
                }
            } else if (element.type === 'radio') {
                element.checked = element.value === value;
            } else if(element.type === 'select-multiple' && Array.isArray(value)) {
                [...element.options].forEach(option => option.selected = value.includes(option.value));
            } else {
                element.value = value;
            }
        })
    }
}

module.exports = {
    updateBoundElementsByChanges,
    updateBoundElementsByPropsIteration,
    updateBoundElements
};