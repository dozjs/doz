const {REGEX, ATTR, CMP_INSTANCE, DIR_IS} = require('../constants');
const castStringTo = require('../utils/cast-string-to');
const objectPath = require('../utils/object-path');

function isEventAttribute(name) {
    return REGEX.IS_LISTENER.test(name);
}

function setAttribute($target, name, value, cmp) {

    [name, value] = cmp.$beforeAttributeSet($target, name, value);

    if (isCustomAttribute(name) || cmp.constructor._isBindAttribute(name) || cmp.constructor._isRefAttribute(name)) {
    } else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
    } else if (typeof value === 'object') {
        try {
            $target.setAttribute(name, JSON.stringify(value));
        } catch (e) {

        }
    } else {
        if (value === undefined) value = '';
        $target.setAttribute(name, value);
    }
}

function removeAttribute($target, name, cmp) {
    if (isCustomAttribute(name)
        || cmp.constructor._isBindAttribute(name)
        || cmp.constructor._isRefAttribute(name)
        || !$target) {
    } else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal, cmp) {
    if (newVal === '') {
        removeAttribute($target, name, cmp);
        cmp.$attributeUpdate($target, name, newVal);
    } else if (oldVal === '' || newVal !== oldVal) {
        setAttribute($target, name, newVal, cmp);
        cmp.$attributeUpdate($target, name, newVal);
    }
}

function updateAttributes($target, newProps, oldProps = {}, cmp) {
    const props = Object.assign({}, newProps, oldProps);
    let updated = [];
    Object.keys(props).forEach(name => {
        if(!$target || $target.nodeType !== 1) return;
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
    return isEventAttribute(name) || name === ATTR.FORCE_UPDATE;
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
    else {
        value = value.replace(REGEX.THIS_TARGET, '$target');

        const _func = function () {
            eval(value)
        };
        $target.addEventListener(
            extractEventName(name),
            _func.bind(cmp)
        );
    }
}

function attach($target, props, cmp) {

    let bindValue;
    let name;

    const propsKeys = Object.keys(props);

    for(let i = 0, len = propsKeys.length; i < len; i++) {
        name = propsKeys[i];
        setAttribute($target, name, props[name], cmp);
        addEventListener($target, name, props[name], cmp);

        let canBindValue = cmp.$attributeCreate($target, name, props[name]);
        if (canBindValue) bindValue = canBindValue;
    }

    const datasetArray = Object.keys($target.dataset);
    for (let i = 0; i < datasetArray.length; i++) {
        if (REGEX.IS_LISTENER.test(datasetArray[i]))
            addEventListener($target, i, $target.dataset[datasetArray[i]], cmp);
    }

    cmp.$attributesCreate($target, bindValue);
}

module.exports = {
    attach,
    updateAttributes
};