const proxy = require('../utils/proxy');
const events = require('./events');
const objectPath = require('../utils/object-path');

function delay(cb) {
    if (window.requestAnimationFrame !== undefined)
        return window.requestAnimationFrame(cb);
    else
        return window.setTimeout(cb);
}

function updateChildren(instance, changes) {

    const children = Object.keys(instance.children);

    children.forEach(i => {
        console.log(instance.children[i]._publicProps);
    });

    /*changes.forEach(item => {
        if (instance._boundElements.hasOwnProperty(item.property)) {
            instance._boundElements[item.property].forEach(element => {
                element.value = item.newValue;
            })
        }
    });*/
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

function create(instance, props) {
    instance.props = proxy.create(props, true, changes => {
        instance.render();
        updateBound(instance, changes);

        if (instance._isCreated) {
            delay(()=>{
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