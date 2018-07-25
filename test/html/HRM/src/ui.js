import {component} from '../../../../index'
import './cmp/hello/index'

component('app-ui', {
    template() {
        return `
            <div>
                <app-hello></app-hello>
                <button onclick="console.log('hello click')">Click me!</button>
            </div>
        `
    }
});