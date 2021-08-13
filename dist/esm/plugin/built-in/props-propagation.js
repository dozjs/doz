export default (function (Doz, app) {
    function propagate(child, changes) {
        let mainParent = child._propsPropagationMainParent;
        if (changes) {
            //console.log(changes)
            // when update use this
            changes.forEach(change => {
                if (change.type !== 'update' ||
                    (mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(change.currentPath) === -1))
                    return;
                child.props[change.currentPath] = change.newValue;
            });
        }
        else {
            //console.log('initial')
            // when initialize use this
            Object.keys(mainParent.props).forEach(propParent => {
                if (mainParent._propsPropagationIsArray && mainParent.propsPropagation.indexOf(propParent) === -1)
                    return;
                child.props[propParent] = mainParent.props[propParent];
            });
        }
    }
    function propagateToAll(mainParent, changes) {
        //console.log(mainParent._propsPropagationChildren)
        mainParent._propsPropagationChildren.forEach(child => {
            propagate(child, changes);
        });
    }
    function addToPropagation(child) {
        child._propsPropagationMainParent._propsPropagationChildren.push(child);
    }
    function removeFromPropagation(child) {
        let children = child._propsPropagationMainParent._propsPropagationChildren;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i] === child) {
                children.splice(i, 1);
            }
        }
    }
    app.on('componentPropsInit', component => {
        // for MainParent only
        if (component.propsPropagation) {
            Object.defineProperties(component, {
                _propsPropagationIsArray: {
                    value: Array.isArray(component.propsPropagation)
                },
                _propsPropagationIsMainParent: {
                    value: true
                },
                _propsPropagationMainParent: {
                    value: component
                },
                _propsPropagationChildren: {
                    value: []
                }
            });
        }
        if (component.parent && component.parent.propsPropagation) {
            component.propsPropagation = component.parent.propsPropagation;
            component._propsPropagationMainParent = component.parent._propsPropagationMainParent;
            if (component.excludeFromPropsPropagation) {
                Object.defineProperty(component, 'excludeFromPropsPropagation', { value: true });
            }
            else {
                addToPropagation(component);
                propagate(component);
            }
        }
    });
    app.on('componentUpdate', (component, changes) => {
        if (component._propsPropagationIsMainParent) {
            propagateToAll(component, changes);
        }
    });
    app.on('componentDestroy', component => {
        // belongs to a context
        if (component._propsPropagationMainParent) {
            removeFromPropagation(component);
        }
    });
});