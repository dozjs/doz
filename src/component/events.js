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

function callRender(context) {
    if(typeof context.onRender === 'function'){
        context.onRender.call(context);
    }
}

function callBeforeUpdate(context, property, currentPath) {
    if(typeof context.onBeforeUpdate === 'function'){
        return context.onBeforeUpdate.call(context, Object.assign({}, context.props), property, currentPath);
    }
}

function callUpdate(context) {
    if(typeof context.onUpdate === 'function'){
        context.onUpdate.call(context);
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
    callRender,
    callBeforeUpdate,
    callUpdate,
    callBeforeDestroy,
    callDestroy
};