import index from "../../index.js";
import delay from "../../../utils/delay.js";
const { directive } = index;
export default (function () {
    directive('bind', {
        // Start directive methods
        onAppComponentCreate(instance) {
            Object.defineProperties(instance, {
                _boundElements: {
                    value: {},
                    writable: true
                }
            });
        },
        onAppComponentUpdate(instance, changes) {
            if (!Object.keys(instance._boundElements).length)
                return;
            //delay(() => {
            this.updateBoundElementsByChanges(instance, changes);
            //});
        },
        onAppComponentLoadProps(instance) {
            //delay(() => {
            this.updateBoundElementsByPropsIteration(instance);
            //});
        },
        onComponentDOMElementCreate(instance, $target, directiveValue, initial) {
            if (!this.canBind($target))
                return;
            this.setBind(instance, $target, directiveValue);
        },
        // End directive methods
        // Start custom methods
        canBind($target) {
            return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1;
        },
        setBind(instance, $target, value) {
            if (instance.props[value] === undefined)
                return;
            // Add UI events
            let events = ['compositionstart', 'compositionend', 'input', 'change'];
            events.forEach(function (event) {
                $target.addEventListener(event, function (e) {
                    let _value;
                    if (this.type === 'checkbox') {
                        if (!this.defaultValue)
                            instance.props[value] = this.checked;
                        else {
                            const inputs = instance.appRoot.querySelectorAll(`input[name=${this.name}][type=checkbox]:checked`);
                            _value = [...inputs].map(input => input.value);
                            //instance.props[value] = castStringTo(_value);
                            instance.props[value] = _value;
                        }
                    }
                    else {
                        _value = this.value;
                        if (this.multiple) {
                            _value = [...this.options].filter(option => option.selected).map(option => option.value);
                        }
                        //instance.props[value] = castStringTo(_value);
                        instance.props[value] = _value;
                    }
                });
            });
            // Map $target element with prop name
            if (instance._boundElements[value] !== undefined) {
                instance._boundElements[value].push($target);
            }
            else {
                instance._boundElements[value] = [$target];
            }
            // Set first value
            // Why this delay? because I need to waiting options tag
            delay(() => {
                this.updateBoundElement($target, instance.props[value], instance);
            });
        },
        updateBoundElementsByChanges(instance, changes) {
            changes.forEach(item => {
                let value = item.newValue;
                let property = item.property;
                this.updateBoundElements(instance, value, property);
            });
        },
        updateBoundElementsByPropsIteration(instance) {
            let _this = this;
            (function iterate(props) {
                let keys = Object.keys(props);
                for (let i = 0, l = keys.length; i < l; i++) {
                    let property = keys[i];
                    if (props[property] instanceof Object && props[property] !== null) {
                        iterate(props[property]);
                    }
                    else {
                        _this.updateBoundElements(instance, props[property], property);
                    }
                }
            })(instance._rawProps);
        },
        updateBoundElements(instance, value, property) {
            if (Object.prototype.hasOwnProperty.call(instance._boundElements, property)) {
                instance._boundElements[property].forEach($target => {
                    this.updateBoundElement($target, value, instance);
                });
            }
        },
        updateBoundElement($target, value, instance) {
            if ($target.type === 'checkbox') {
                if (!$target.defaultValue)
                    $target.checked = value;
                else if (Array.isArray(value)) {
                    const inputs = instance.appRoot.querySelectorAll(`input[name=${$target.name}][type=checkbox]`);
                    [...inputs].forEach(input => input.checked = value.includes(input.value));
                }
            }
            else if ($target.type === 'radio') {
                $target.checked = $target.value === value;
            }
            else if ($target.type === 'select-multiple' && Array.isArray(value)) {
                [...$target.options].forEach(option => option.selected = value.includes(option.value));
            }
            else {
                $target.value = value;
            }
        }
    });
});
