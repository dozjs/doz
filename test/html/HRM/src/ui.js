import {component} from '../../../../index'
import './cmp/hello/index'

component('app-ui', {
    props: {
        count: 0
    },
    template() {
        return `
            <div>
                <app-hello></app-hello> ${this.props.count}
                <button onclick="this.props.count++">Click me</button>
            </div>
        `
    },
    onCreate() {
        if (module.hot) {
            window.__hotStore = window.__hotStore || new Map();
            this.props.count = window.__hotStore.get('count') || 0;
            module.hot.dispose(() => {
                window.__hotStore.set('count', this.props.count);
            });
        }
    }
});