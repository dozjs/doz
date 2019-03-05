const delay = require('../utils/delay');

function callBeforeCreate(context) {
    if(typeof context.onBeforeCreate === 'function'){
        return context.onBeforeCreate.call(context);
    }
    if(context.parent && typeof context.parent[context.__onBeforeCreate] === 'function'){
        return context.parent[context.__onBeforeCreate].call(context.parent, context);
    }
}

function callCreate(context) {
    if(typeof context.onCreate === 'function'){
        context.onCreate.call(context);
    }
    if(context.parent && typeof context.parent[context.__onCreate] === 'function'){
        context.parent[context.__onCreate].call(context.parent, context);
    }
    context.app.emit('componentCreate', context);
}

function callConfigCreate(context) {
    if(typeof context.onConfigCreate === 'function'){
        context.onConfigCreate.call(context);
    }
    if(context.parent && typeof context.parent[context.__onConfigCreate] === 'function'){
        context.parent[context.__onConfigCreate].call(context.parent, context);
    }
    context.app.emit('componentConfigCreate', context);
}

function callBeforeMount(context) {
    if(typeof context.onBeforeMount === 'function'){
        return context.onBeforeMount.call(context);
    }
    if(context.parent && typeof context.parent[context.__onBeforeMount] === 'function'){
        return context.parent[context.__onBeforeMount].call(context.parent, context);
    }
}

function callMount(context) {
    if(typeof context.onMount === 'function'){
        context.onMount.call(context);
    }
    if(context.parent && typeof context.parent[context.__onMount] === 'function'){
        context.parent[context.__onMount].call(context.parent, context);
    }
    context.app.emit('componentMount', context);
}

function callMountAsync(context) {
    if(typeof context.onMountAsync === 'function'){
        delay(()=>{
            context.onMountAsync.call(context);
        });
    }
    if(context.parent && typeof context.parent[context.__onMountAsync] === 'function'){
        delay(()=>{
            context.parent[context.__onMountAsync].call(context.parent, context);
        });
    }
    context.app.emit('componentMountAsync', context);
}

function callBeforeUpdate(context, changes) {
    if(typeof context.onBeforeUpdate === 'function'){
        return context.onBeforeUpdate.call(context, changes);
    }
    if(context.parent && typeof context.parent[context.__onBeforeUpdate] === 'function'){
        return context.parent[context.__onBeforeUpdate].call(context.parent, context, changes);
    }
}

function callUpdate(context, changes) {
    if(typeof context.onUpdate === 'function'){
        context.onUpdate.call(context, changes);
    }
    if(context.parent && typeof context.parent[context.__onUpdate] === 'function'){
        context.parent[context.__onUpdate].call(context.parent, context, changes);
    }
    context.app.emit('componentUpdate', context, changes);
}

function callAfterRender(context, changes) {
    if(typeof context.onAfterRender === 'function'){
        return context.onAfterRender.call(context, changes);
    }
    if(context.parent && typeof context.parent[context.__onAfterRender] === 'function'){
        return context.parent[context.__onAfterRender].call(context.parent, context, changes);
    }
}

function callBeforeUnmount(context) {
    if(typeof context.onBeforeUnmount === 'function'){
        return context.onBeforeUnmount.call(context);
    }
    if(context.parent && typeof context.parent[context.__onBeforeUnmount] === 'function'){
        return context.parent[context.__onBeforeUnmount].call(context.parent, context);
    }
}

function callUnmount(context) {
    if(typeof context.onUnmount === 'function'){
        context.onUnmount.call(context);
    }
    if(context.parent && typeof context.parent[context.__onUnmount] === 'function'){
        context.parent[context.__onUnmount].call(context.parent, context);
    }
    context.app.emit('componentUnmount', context);
}

function callBeforeDestroy(context) {
    if(typeof context.onBeforeDestroy === 'function'){
        return context.onBeforeDestroy.call(context);
    }
    if(context.parent && typeof context.parent[context.__onBeforeDestroy] === 'function'){
        return context.parent[context.__onBeforeDestroy].call(context.parent, context);
    }
}

function callDestroy(context) {
    context.app.emit('componentDestroy', context);
    if(typeof context.onDestroy === 'function' && context.parent && typeof context.parent[context.__onDestroy] === 'function'){
        context.onDestroy.call(context);
        context.parent[context.__onDestroy].call(context.parent, context);
        context = null;
    } else if(typeof context.onDestroy === 'function'){
        context.onDestroy.call(context);
        context = null;
    }else if(context.parent && typeof context.parent[context.__onDestroy] === 'function'){
        context.parent[context.__onDestroy].call(context.parent, context);
        context = null;
    }
}

module.exports = {
    callBeforeCreate,
    callCreate,
    callConfigCreate,
    callBeforeMount,
    callMount,
    callMountAsync,
    callBeforeUpdate,
    callUpdate,
    callAfterRender,
    callBeforeUnmount,
    callUnmount,
    callBeforeDestroy,
    callDestroy
};