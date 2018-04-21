const proxy = require('../utils/proxy');
const events = require('./events');

function delay(cb) {
    if (window.requestAnimationFrame !== undefined)
        return window.requestAnimationFrame(cb);
    else
        return window.setTimeout(cb);
}

function create(instance, props) {
    instance.props = proxy.create(props, true, changes => {
        instance.render();
        changes.forEach(item => {
            if (instance._boundElements.hasOwnProperty(item.property)) {
                instance._boundElements[item.property].forEach(element => {
                    element.value = item.newValue;
                })
            }
        });

        if (instance._isCreated) {
            delay(()=>{
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