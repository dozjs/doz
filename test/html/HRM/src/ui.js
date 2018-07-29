import {component} from '../../../../index'
import './cmp/hello/index'
import hrm from './hrm'

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
        hrm(this, module);
    }
});