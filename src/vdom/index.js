const {REGEX, ATTR} = require('../constants');

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
    return ['INPUT', 'TEXTAREA'].indexOf($target.nodeName) !== -1
}

function isCustomAttribute(name) {
    return isEventAttribute(name)
        || isBindAttribute(name)
        || isRefAttribute(name)
        || name === 'forceUpdate';
}

function setBooleanAttribute($target, name, value) {
    if (value) {
        $target.setAttribute(name, value);
        $target[name] = true;
    } else {
        $target[name] = false;
    }
}

function removeBooleanAttribute($target, name) {
    $target.removeAttribute(name);
    $target[name] = false;
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function setAttribute($target, name, value) {
    if (isCustomAttribute(name)) {
    } else if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
        setBooleanAttribute($target, name, value);
    } else if (typeof value === 'object'){
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
    } else if (name === 'className') {
        $target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
        removeBooleanAttribute($target, name);
    } else {
        $target.removeAttribute(name);
    }
}

function updateAttribute($target, name, newVal, oldVal) {
    if (!newVal) {
        removeAttribute($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
        setAttribute($target, name, newVal);
    }
}

function updateAttributes($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
        updateAttribute($target, name, newProps[name], oldProps[name]);
    });
}

function addEventListener($target, name, value, cmp) {

    if (!isEventAttribute(name)) return;

    let match = value.match(REGEX.GET_LISTENER);

    if (match) {
        let args = null;
        let handler = match[1];
        let stringArgs = match[2];
        if (stringArgs) {
            args = stringArgs.split(',').map(item => item.trim())
        }

        if (handler in cmp) {
            value = args
                ? cmp[handler].bind(cmp, args)
                : cmp[handler].bind(cmp);
        }
    }

    $target.addEventListener(
        extractEventName(name),
        value
    );
}

function setBind($target, name, value, cmp) {
    if (!isBindAttribute(name) || !canBind($target)) return;
    if (typeof cmp.props[value] !== 'undefined') {
        ['compositionstart', 'compositionend', 'input', 'change']
            .forEach(function (event) {
                $target.addEventListener(event, function () {
                    cmp.props[value] = this.value;
                });
            });
        if (cmp._boundElements.hasOwnProperty(value)) {
            cmp._boundElements[value].push($target);
        } else {
            cmp._boundElements[value] = [$target];
        }
    }
}

function setRef($target, name, value, cmp) {
    if (!isRefAttribute(name)) return;
    cmp.ref[value] = $target
}

function attach($target, props, cmp) {
    Object.keys(props).forEach(name => {
        setAttribute($target, name, props[name]);
        addEventListener($target, name, props[name], cmp);
        setBind($target, name, props[name], cmp);
        setRef($target, name, props[name], cmp);
    });
}

function createElement(node, cmp) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);

    attach($el, node.props, cmp);

    node.children
        .map(item => createElement(item, cmp))
        .forEach($el.appendChild.bind($el));
    return $el;
}

function changed(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceUpdate;
}

function updateElement($parent, newNode, oldNode, index = 0, cmp) {
    if (!$parent) return;

    if (!oldNode) {
        const rootElement = createElement(newNode, cmp);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index])
            $parent.removeChild(
                $parent.childNodes[index]
            );
    } else if (changed(newNode, oldNode)) {
        const rootElement = createElement(newNode, cmp);
        $parent.replaceChild(
            rootElement,
            $parent.childNodes[index]
        );
        return rootElement;
    } else if (newNode.type) {
        updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props
        );
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            updateElement(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i,
                cmp
            );
        }
    }
}

module.exports = {
    updateElement
};