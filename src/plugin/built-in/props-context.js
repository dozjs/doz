module.exports = function(Doz, app) {

    function updateContextChild(child) {
        let mainParent = child._propsContextMainParent;
        Object.keys(mainParent.props).forEach(propParent => {
            if (mainParent._propsContextIsArray && mainParent.propsContext.indexOf(propParent) === -1) return;
            child.props[propParent] = mainParent.props[propParent];
        })
    }

    function updateContext(mainParent) {
        //console.log(mainParent._propsContextChildren)
        mainParent._propsContextChildren.forEach(child => {
            updateContextChild(child)
        })
    }

    function addToContext(child) {
        child._propsContextMainParent._propsContextChildren.push(child)
    }

    function removeFromContext(child) {
        let children = child._propsContextMainParent._propsContextChildren;
        for(let i= children.length - 1; i>=0; i--) {
            if(children[i] === child) {
                children.splice(i,1);
            }
        }
    }

    app.on('componentPropsInit', component => {
        // for MainParent only
        if (component.propsContext) {
            component._propsContextIsArray = Array.isArray(component.propsContext);
            component._propsContextIsMainParent = true;
            component._propsContextMainParent = component;
            component._propsContextChildren = [];
        }

        if (component.parent && component.parent.propsContext) {

            component.propsContext = component.parent.propsContext;
            component._propsContextMainParent = component.parent._propsContextMainParent;

            if (component.excludeFromPropsContext) {
                Object.defineProperty(component, 'excludeFromPropsContext', {value: true})
            } else {
                addToContext(component);
                updateContextChild(component);
            }

        }
    });

    app.on('componentUpdate', component => {
        if (component._propsContextIsMainParent) {
            updateContext(component);
        }
    });

    app.on('componentDestroy', component => {
        // belongs to a context
        if (component._propsContextMainParent) {
            removeFromContext(component)
        }
    })
};