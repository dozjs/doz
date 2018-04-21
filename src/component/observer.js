const proxy = require('../utils/proxy');
const events = require('./events');

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
            window.requestAnimationFrame(()=>{
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