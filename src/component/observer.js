const proxy = require('../utils/proxy');
const events = require('./events');

function delay(cb) {
    if (window.requestAnimationFrame !== undefined)
        return window.requestAnimationFrame(cb);
    else
        return window.setTimeout(cb);
}

function updateChildren(instance, changes) {

    if (!instance.updateChildrenProps) return;

    const children = Object.keys(instance.children);

    children.forEach(i => {
        changes.forEach(item => {
            if (instance.children[i]._publicProps.hasOwnProperty(item.currentPath)
                && instance.children[i].props.hasOwnProperty(item.currentPath))
                instance.children[i].props[item.currentPath] = item.newValue;
        });
    });
}

function updateBound(instance, changes) {
    changes.forEach(item => {
        if (instance._boundElements.hasOwnProperty(item.property)) {
            instance._boundElements[item.property].forEach(element => {
                element.value = item.newValue;
            })
        }
    });
}

function drawIterated(instance) {
    Object.keys(instance._loops).forEach(ID => {
        let root = document.querySelector(ID);
        if (root) {
            instance._loops[ID].forEach(cmp => {
                cmp.instance = instance.mount(cmp.tpl, {selector: root});
            });
        }
    });
}

function create(instance, props) {
    instance.props = proxy.create(props, true, changes => {
        instance.render();
        updateBound(instance, changes);
        drawIterated(instance);
        if (instance._isCreated) {
            delay(() => {
                updateChildren(instance, changes);
                events.callUpdate(instance);
            });
        }
    });

    proxy.beforeChange(instance.props, () => {
        const res = events.callBeforeUpdate(instance);
        if (res === false)
            return false;
    });
}

module.exports = {
    create
};