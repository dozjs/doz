const deprecate = require('../utils/deprecate');
const delay = require('../utils/delay');

function callBeforeCreate(context) {
    if(typeof context.onBeforeCreate === 'function'){
        return context.onBeforeCreate.call(context);
    }
}

function callCreate(context) {
    if(typeof context.onCreate === 'function'){
        context.onCreate.call(context);
    }
}

function callConfigCreate(context) {
    if(typeof context.onConfigCreate === 'function'){
        context.onConfigCreate.call(context);
    }
}

function callRender(context) {
    if(typeof context.onRender === 'function'){
        deprecate.once('onRender is deprecated since v. 1.0.0, use onMount instead');
        context.onRender.call(context);
    }
}

function callBeforeMount(context) {
    if(typeof context.onBeforeMount === 'function'){
        return context.onBeforeMount.call(context);
    }
}

function callMount(context) {
    if(typeof context.onMount === 'function'){
        context.onMount.call(context);
    }
}

function callMountAsync(context) {
    if(typeof context.onMountAsync === 'function'){
        delay(()=>{
            context.onMountAsync.call(context);
        });
    }
}

function callBeforeUpdate(context, changes) {
    if(typeof context.onBeforeUpdate === 'function'){
        return context.onBeforeUpdate.call(context, changes);
    }
}

function callUpdate(context, changes) {
    if(typeof context.onUpdate === 'function'){
        context.onUpdate.call(context, changes);
    }
}

function callAfterRender(context, changes) {
    if(typeof context.onAfterRender === 'function'){
        return context.onAfterRender.call(context, changes);
    }
}

function callBeforeUnmount(context) {
    if(typeof context.onBeforeUnmount === 'function'){
        return context.onBeforeUnmount.call(context);
    }
}

function callUnmount(context) {
    if(typeof context.onUnmount === 'function'){
        context.onUnmount.call(context);
    }
}

function callBeforeDestroy(context) {
    if(typeof context.onBeforeDestroy === 'function'){
        return context.onBeforeDestroy.call(context);
    }
}

function callDestroy(context) {
    if(typeof context.onDestroy === 'function'){
        context.onDestroy.call(context);
        context = null;
    }
}

module.exports = {
    callBeforeCreate,
    callCreate,
    callConfigCreate,
    callRender,
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