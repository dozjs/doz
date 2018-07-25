import {component} from '../../../../../../../index'
import style from './style.css'

component('app-world', {
    template() {
        return `
            <span class="${style.myColor}">
                world!!!
            </span>
        `
    }
});