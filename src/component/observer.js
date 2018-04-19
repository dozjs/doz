const proxy = require('../utils/proxy');
const events = require('./events');

function create(instance, props) {
    instance.props = proxy.create(props, true, changes => {
        //console.time('render in observer');
        instance.render();
        //console.timeEnd('render in observer');

        //console.time('changes');
        changes.forEach(item => {
            if (instance._boundElements.hasOwnProperty(item.property)) {
                instance._boundElements[item.property].forEach(element => {
                    element.value = item.newValue;
                })
            }
        });
        //console.timeEnd('changes');

        if (instance._isCreated) {
            events.callUpdate(instance);
        }
    });

    proxy.beforeChange(instance.props, () => {
        const res = events.callBeforeUpdate(Object.assign({}, instance.props));
        if (res === false)
            return false;
    });
}

module.exports = {
    create
};