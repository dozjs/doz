const {REGEX, ATTR} = require('../constants');
const castStringTo = require('../utils/cast-string-to');
const dashToCamel = require('../utils/dash-to-camel');
const camelToDash = require('../utils/camel-to-dash');
const objectPath = require('../utils/object-path');
const delay = require('../utils/delay');

function isEventAttribute(name) {
    return REGEX.IS_LISTENER.test(name);
}

function isBindAttribute(name) {
    return name === ATTR.BIND;
}

function isRefAttribute(name) {
    return name === ATTR.REF;
}

function canBind($target) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf($target.nodeName) !== -1
}

function setAttribute($target, name, value, cmp) {
    if (REGEX.IS_CUSTOM_TAG.test($target.nodeName))
        name = camelToDash(name);
    if (isCustomAttribute(name)) {
    } else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
    } else if (typeof value === 'object') {
        try {
            $target.setAttribute(name, JSON.stringify(value));
        } catch (e) {

        }
    } else {
        $target.setAttribute(name, value);
    }
}

function removeAttribute($target, name, value) {
    if (isCustomAttribute(name)) {
    } else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal, cmp) {
    if (!newVal /*&& newVal !== false*/) {
        removeAttribute($target, name, oldVal, cmp);
        updateChildren(cmp, name, newVal);
    } else if (!oldVal || newVal !== oldVal) {
        setAttribute($target, name, newVal, cmp);
        updateChildren(cmp, name, newVal);
    }
}

function updateChildren(cmp, name, value) {
    if (cmp && cmp.updateChildrenProps) {
        const children = Object.keys(cmp.children);
        name = dashToCamel(name);

        //if (cmp.tag === 'app-form')
            console.log(cmp.id);

        children.forEach(i => {
            if (name === 'label')
                console.log(name, value);
            if (cmp.children[i]._publicProps.hasOwnProperty(name)
                && cmp.children[i].props.hasOwnProperty(name))
                cmp.children[i].props[name] = value;
        });
    }
}

function updateAttributes($target, newProps, oldProps = {}, cmp) {
    const props = Object.assign({}, newProps, oldProps);
    let updated = [];
    Object.keys(props).forEach(name => {
        updateAttribute($target, name, newProps[name], oldProps[name], cmp);
        if (newProps[name] !== oldProps[name]) {
            let obj = {};
            obj[name] = newProps[name];
            updated.push(obj);
        }
    });

    return updated;
}

function isCustomAttribute(name) {
    return isEventAttribute(name)
        || isBindAttribute(name)
        || isRefAttribute(name)
        || name === ATTR.FORCE_UPDATE;
}

function setBooleanAttribute($target, name, value) {
    $target.setAttribute(name, value);
    $target[name] = value;
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function trimQuotes(str) {
    return str.replace(REGEX.TRIM_QUOTES, '$1');
}

function addEventListener($target, name, value, cmp) {

    if (!isEventAttribute(name)) return;

    let match = value.match(REGEX.GET_LISTENER);

    if (match) {
        let args = null;
        let handler = match[1];
        let stringArgs = match[2];
        if (stringArgs) {
            args = stringArgs.split(',').map(item => {
                item = item.trim();
                return item === 'this' ? cmp : castStringTo(trimQuotes(item))
            })
        }

        let isParentMethod = handler.match(REGEX.IS_PARENT_METHOD);

        if (isParentMethod) {
            handler = isParentMethod[1];
            cmp = cmp.parent;
        }

        const method = objectPath(handler, cmp);

        if (method !== undefined) {
            value = args
                ? method.bind(cmp, ...args)
                : method.bind(cmp);
        }
    }

    if (typeof value === 'function')
        $target.addEventListener(
            extractEventName(name),
            value
        );
}

function setBind($target, name, value, cmp) {
    if (!isBindAttribute(name) || !canBind($target)) return;
    if (typeof cmp.props[value] !== 'undefined') {

        let events = ['compositionstart', 'compositionend', 'input', 'change'];

        events.forEach(function (event) {
            $target.addEventListener(event, function (e) {
                let _value;
                if (this.type === 'checkbox') {
                    if(!this.defaultValue)
                        cmp.props[value] = this.checked;
                    else {
                        const inputs = document.querySelectorAll(`input[name=${this.name}][type=checkbox]:checked`);
                        _value = [...inputs].map(input => input.value);
                        cmp.props[value] = _value;
                    }
                } else {
                    _value = this.value;
                    if (this.multiple) {
                        _value = [...this.options].filter(option => option.selected).map(option => option.value);
                    }
                    cmp.props[value] = _value;
                }
            });
        });

        if (cmp._boundElements.hasOwnProperty(value)) {
            cmp._boundElements[value].push($target);
        } else {
            cmp._boundElements[value] = [$target];
        }

        return true;
    }
}

function setRef($target, name, value, cmp) {
    if (!isRefAttribute(name)) return;
    cmp.ref[value] = $target
}

function attach($target, props, cmp) {
    let bindValue;

    Object.keys(props).forEach(name => {
        setAttribute($target, name, props[name], cmp);
        addEventListener($target, name, props[name], cmp);
        if (setBind($target, name, props[name], cmp)) {
            bindValue = cmp.props[props[name]];
        }
        setRef($target, name, props[name], cmp);
    });

    for (let i in $target.dataset) {
        if ($target.dataset.hasOwnProperty(i) && REGEX.IS_LISTENER.test(i)) {
            addEventListener($target, i, $target.dataset[i], cmp);
        }
    }

    if (typeof bindValue !== 'undefined') {
        delay(() => {
            let inputs;
            if ($target.type === 'radio') {
                inputs = document.querySelectorAll(`input[name=${$target.name}][type=radio]`);
                inputs.forEach(input => input.checked = bindValue === input.value);
            } else if ($target.type === 'checkbox') {
                if(typeof bindValue === 'object') {
                    inputs = document.querySelectorAll(`input[name=${$target.name}][type=checkbox]`);
                    inputs.forEach(input => input.checked = Array.from(bindValue).includes(input.value));
                } else
                    $target.checked = bindValue;
            } else {
                $target.value = bindValue;
            }
        });
    }
}

module.exports = {
    attach,
    updateAttributes
};