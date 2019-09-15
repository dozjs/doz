const {directive} = require('../index');
const castStringTo = require('../../utils/cast-string-to');

directive('bind', {

    onSystemComponentCreate(instance) {
        Object.defineProperties(instance, {
            _boundElements: {
                value: {},
                writable: true
            }
        });
    },

    onDOMElementCreate(instance, $target, directiveValue, initial) {
        if (!this._canBind($target)) return;
        //console.log($target.nodeName, directiveValue);
        //console.log(instance.props[directiveValue])
        this._setBind(instance, $target, directiveValue)
    },

    _canBind($target) {
        return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1
    },

    _setBind(instance, $target, value) {
        if (instance.props[value] !== undefined) {

            let events = ['compositionstart', 'compositionend', 'input', 'change'];

            events.forEach(function (event) {
                $target.addEventListener(event, function (e) {
                    let _value;
                    if (this.type === 'checkbox') {
                        if(!this.defaultValue)
                            instance.props[value] = this.checked;
                        else {
                            const inputs = document.querySelectorAll(`input[name=${this.name}][type=checkbox]:checked`);
                            _value = [...inputs].map(input => input.value);
                            instance.props[value] = castStringTo(_value);
                        }
                    } else {
                        _value = this.value;
                        if (this.multiple) {
                            _value = [...this.options].filter(option => option.selected).map(option => option.value);
                        }
                        instance.props[value] = castStringTo(_value);
                    }
                });
            });

            if (Object.prototype.hasOwnProperty.call(instance._boundElements, value)) {
                instance._boundElements[value].push($target);
            } else {
                instance._boundElements[value] = [$target];
            }

            return true;
        }
    }
});
