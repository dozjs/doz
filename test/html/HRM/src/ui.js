import {component} from '../../../../index'
import './cmp/hello/index'

component('app-ui', {
    template() {
        return `
            <div>
                ${Math.random()}
                <app-hello></app-hello>
            </div>
        `
    }
});