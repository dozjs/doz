import {component} from '../../../../../../index'
import './world'

component('app-hello', {
    template() {
        return `
            <h1>
                ciao <app-world></app-world>
            </h1>
        `
    }
});