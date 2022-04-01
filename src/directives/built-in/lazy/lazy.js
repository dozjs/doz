const {directive} = require('../../index');

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

directive('lazy', {
    onAppInit(app) {
        Object.defineProperties(app, {
            lazyComponentsList: {
                value: new Set(),
                enumerable: false
            }
        });
        window.addEventListener('scroll', () => {
            app.lazyComponentsList.forEach(component => {
                if(isInViewport(component.$domEl)) {
                    component.runMount();
                    app.lazyComponentsList.delete(component);
                }
            })
        })
    },
    onComponentCreate(instance) {
        instance.waitMount = true;
        instance.appReadyExcluded = true;
        instance.app.lazyComponentsList.add(instance);
    }
});