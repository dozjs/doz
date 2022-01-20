import proxy from "../proxy.js";
import events from "./hooks.js";
import propsListener from "./helpers/props-listener.js";
import manipulate from "./helpers/manipulate.js";
function runUpdate(instance, changes) {
    events.callUpdate(instance, changes);
    propsListener(instance, changes);
    instance.render(undefined, changes);
}
function create(instance) {
    let recreate = false;
    if (instance._props && instance._props.__isProxy) {
        proxy.remove(instance._props);
        recreate = true;
    }
    instance._props = proxy.create(instance._rawProps, true, changes => {
        if (!instance._isRendered)
            return;
        if (instance.delayUpdate) {
            setTimeout(() => {
                runUpdate(instance, changes);
            }, instance.delayUpdate);
        }
        else {
            runUpdate(instance, changes);
        }
    }, (target, property) => {
        target[property] = manipulate(instance, target[property], property);
    });
    proxy.manipulate(instance._props, (value, currentPath, onFly) => {
        return manipulate(instance, value, currentPath, onFly);
    });
    proxy.beforeChange(instance._props, changes => {
        const res = events.callBeforeUpdate(instance, changes);
        if (res === false)
            return false;
    });
    if (recreate && instance._isRendered) {
        instance.render();
    }
}
export { create };
export default {
    create
};
