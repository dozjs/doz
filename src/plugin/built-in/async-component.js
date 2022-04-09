const createInstance = require('../../component/create-instance')
const asyncComponentsDB = new Set();

const asyncComponent = {

    loadComponent(id, promiseFunc, props) {
        if (window.SSR) return;

        //if (asyncComponentsDB.has(id)) return ;
        //asyncComponentsDB.add(id);

        let asyncId = Math.random().toString().replace('.', '0');
        let tag = `async-component-${asyncId}`;

        setTimeout(() => {
            promiseFunc().then(o => {
                let oKeys = Object.keys(o);
                let cmp = o[oKeys[oKeys.length - 1]];
                let initialRootElement = document.querySelector(tag);

                if (initialRootElement) {
                    if (cmp.tag) {
                        let newRootElement = document.createElement(cmp.tag);
                        initialRootElement.replaceWith(newRootElement);
                        initialRootElement = newRootElement;
                    }

                    createInstance({
                        componentObject: true,
                        root: initialRootElement,
                        component: cmp,
                        app: this.app,
                        props
                    });
                }
            })
        })
        return tag;
    }
}


module.exports = function(Doz, app) {
    Doz.mixin(asyncComponent);
};