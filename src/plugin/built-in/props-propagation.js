module.exports = function(Doz, app) {

    function updateContextChild(child, changes) {
        let mainParent = child._propsPropagationMainParent;
        if (changes) {
            //console.log(changes)
            // when update use this
            changes.forEach(change => {
                if (
                    change.type !== 'update' ||
                    (mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(change.currentPath) === -1)
                ) return;
                child.props[change.currentPath] = change.newValue;
            })
        } else {
            //console.log('initial')
            // when initialize use this
            Object.keys(mainParent.props).forEach(propParent => {
                if (mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(propParent) === -1) return;
                child.props[propParent] = mainParent.props[propParent];
            })
        }
    }

    function updateContext(mainParent, changes) {
        //console.log(mainParent._propsPropagationChildren)
        mainParent._propsPropagationChildren.forEach(child => {
            updateContextChild(child, changes)
        })
    }

    function addToContext(child) {
        child._propsPropagationMainParent._propsPropagationChildren.push(child)
    }

    function removeFromContext(child) {
        let children = child._propsPropagationMainParent._propsPropagationChildren;
        for(let i= children.length - 1; i>=0; i--) {
            if(children[i] === child) {
                children.splice(i,1);
            }
        }
    }

    app.on('componentPropsInit', component => {
        // for MainParent only
        if (component.propsPropagation) {
            component._propsPropagationIsArray = Array.isArray(component.propsPropagation);
            component._propsPropagationIsMainParent = true;
            component._propsPropagationMainParent = component;
            component._propsPropagationChildren = [];
        }

        if (component.parent && component.parent.propsPropagation) {

            component.propsPropagation = component.parent.propsPropagation;
            component._propsPropagationMainParent = component.parent._propsPropagationMainParent;

            if (component.excludeFrompropsPropagation) {
                Object.defineProperty(component, 'excludeFrompropsPropagation', {value: true})
            } else {
                addToContext(component);
                updateContextChild(component);
            }

        }
    });

    app.on('componentUpdate', (component, changes) => {
        if (component._propsPropagationIsMainParent) {
            updateContext(component, changes);
        }
    });

    app.on('componentDestroy', component => {
        // belongs to a context
        if (component._propsPropagationMainParent) {
            removeFromContext(component)
        }
    })
};