import {component} from '../../../../../../../'
import style from './style.css'

component('app-world', {
    template() {
        return `
            <span class="${style.myColor}">
                mondo!
            </span>
        `
    }
});