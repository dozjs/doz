import delay from "../utils/delay.js";
import directive from "../directives/index.js";
function callBeforeCreate(context) {
    directive.callAppComponentBeforeCreate(context);
    directive.callComponentBeforeCreate(context);
    if (typeof context.onBeforeCreate === 'function') {
        return context.onBeforeCreate.call(context);
    }
}
function callCreate(context) {
    directive.callAppComponentCreate(context);
    directive.callComponentCreate(context);
    if (typeof context.onCreate === 'function') {
        context.onCreate.call(context);
    }
    context.app.emit('componentCreate', context);
}
function callConfigCreate(context) {
    directive.callAppComponentConfigCreate(context);
    if (typeof context.onConfigCreate === 'function') {
        context.onConfigCreate.call(context);
    }
    if (context.parent && typeof context.parent[context.__onConfigCreate] === 'function') {
        context.parent[context.__onConfigCreate].call(context.parent, context);
    }
    context.app.emit('componentConfigCreate', context);
}
function callBeforeMount(context) {
    directive.callAppComponentBeforeMount(context);
    directive.callComponentBeforeMount(context);
    if (typeof context.onBeforeMount === 'function') {
        return context.onBeforeMount.call(context);
    }
}
function callMount(context) {
    directive.callAppComponentMount(context);
    directive.callComponentMount(context);
    if (typeof context.onMount === 'function') {
        context.onMount.call(context);
    }
    context.app.emit('componentMount', context);
}
function callMountAsync(context) {
    delay(() => {
        directive.callAppComponentMountAsync(context);
        directive.callComponentMountAsync(context);
    });
    if (typeof context.onMountAsync === 'function') {
        delay(() => context.onMountAsync.call(context));
    }
    context.app.emit('componentMountAsync', context);
}
function callBeforeUpdate(context, changes) {
    directive.callAppComponentBeforeUpdate(context, changes);
    directive.callComponentBeforeUpdate(context, changes);
    if (typeof context.onBeforeUpdate === 'function') {
        return context.onBeforeUpdate.call(context, changes);
    }
}
function callUpdate(context, changes) {
    directive.callAppComponentUpdate(context, changes);
    directive.callComponentUpdate(context, changes);
    if (typeof context.onUpdate === 'function') {
        context.onUpdate.call(context, changes);
    }
    context.app.emit('componentUpdate', context, changes);
}
function callDrawByParent(context, newNode, oldNode) {
    if (!context)
        return;
    directive.callAppComponentDrawByParent(context, newNode, oldNode);
    if (typeof context.onDrawByParent === 'function') {
        return context.onDrawByParent.call(context, newNode, oldNode);
    }
    if (context.parent && typeof context.parent[context.__onDrawByParent] === 'function') {
        return context.parent[context.__onDrawByParent].call(context.parent, context, newNode, oldNode);
    }
    //context.app.emit('componentDrawByParent', context, changes);
}
function callAfterRender(context, changes) {
    directive.callAppComponentAfterRender(context, changes);
    directive.callComponentAfterRender(context, changes);
    if (typeof context.onAfterRender === 'function') {
        return context.onAfterRender.call(context, changes);
    }
}
function callBeforeUnmount(context) {
    directive.callAppComponentBeforeUnmount(context);
    directive.callComponentBeforeUnmount(context);
    if (typeof context.onBeforeUnmount === 'function') {
        return context.onBeforeUnmount.call(context);
    }
}
function callUnmount(context) {
    directive.callAppComponentUnmount(context);
    directive.callComponentUnmount(context);
    if (typeof context.onUnmount === 'function') {
        context.onUnmount.call(context);
    }
    context.app.emit('componentUnmount', context);
}
function callBeforeDestroy(context) {
    directive.callAppComponentBeforeDestroy(context);
    directive.callComponentBeforeDestroy(context);
    if (typeof context.onBeforeDestroy === 'function') {
        return context.onBeforeDestroy.call(context);
    }
}
function callDestroy(context) {
    directive.callAppComponentDestroy(context);
    directive.callComponentDestroy(context);
    context.app.emit('componentDestroy', context);
    const style = document.getElementById(context.uId + '--style');
    const styleReset = document.getElementById(context.uId + '--style-reset');
    if (style) {
        style.parentNode.removeChild(style);
    }
    if (styleReset) {
        styleReset.parentNode.removeChild(styleReset);
    }
    if (context._unmountedPlaceholder && context._unmountedPlaceholder.parentNode)
        context._unmountedPlaceholder.parentNode.removeChild(context._unmountedPlaceholder);
    if (typeof context.onDestroy === 'function') {
        context.onDestroy.call(context);
        context = null;
    }
}
function callLoadProps(context) {
    directive.callAppComponentLoadProps(context);
    directive.callComponentLoadProps(context);
    if (typeof context.onLoadProps === 'function') {
        context.onLoadProps.call(context);
    }
    context.app.emit('componentLoadProps', context);
}
function callWaitMount(context) {
    directive.callAppComponentWaitMount(context);
    directive.callComponentWaitMount(context);
    if (typeof context.onWaitMount === 'function') {
        context.onWaitMount.call(context);
    }
    context.app.emit('componentWaitMount', context);
}
export { callBeforeCreate };
export { callCreate };
export { callConfigCreate };
export { callBeforeMount };
export { callMount };
export { callMountAsync };
export { callBeforeUpdate };
export { callUpdate };
export { callDrawByParent };
export { callAfterRender };
export { callBeforeUnmount };
export { callUnmount };
export { callBeforeDestroy };
export { callDestroy };
export { callLoadProps };
export { callWaitMount };
export default {
    callBeforeCreate,
    callCreate,
    callConfigCreate,
    callBeforeMount,
    callMount,
    callMountAsync,
    callBeforeUpdate,
    callUpdate,
    callDrawByParent,
    callAfterRender,
    callBeforeUnmount,
    callUnmount,
    callBeforeDestroy,
    callDestroy,
    callLoadProps,
    callWaitMount
};
