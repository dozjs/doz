module.exports = function(Doz, app) {
    app.on('componentMount', component => {
        if (component.parent && component.parent.propsContext) {
            component.propsContext = component.parent.propsContext;
            console.log(component.tag, component.excludeFromPropsContext)
            if (component.excludeFromPropsContext) {
                Object.defineProperty(component, 'excludeFromPropsContext', {value: true})
                return;
            }
            let propsContextIsArray = Array.isArray(component.propsContext);
            Object.keys(component.parent.props).forEach(propParent => {
                if (propsContextIsArray && component.propsContext.indexOf(propParent) === -1) return
                component.props[propParent] = component.parent.props[propParent];
            })
        }
    });

    app.on('componentUpdate', component => {
        if (component.propsContext) {
            let propsContextIsArray = Array.isArray(component.propsContext);
            //console.log('a', component.tag, changes)
            Object.keys(component.children).forEach(child => {
                Object.keys(component.props).forEach(propParent => {
                    if (propsContextIsArray && component.propsContext.indexOf(propParent) === -1) return;
                    if (component.children[child].excludeFromPropsContext) {
                        console.log('ssss')
                        app.emit('componentUpdate', component.children[child], {});
                    } else {
                        component.children[child].props[propParent] = component.props[propParent];
                    }
                })
            })
        }
    });
};