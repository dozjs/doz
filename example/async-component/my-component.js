import {Component} from '../../dist/esm/index.js'

export default class MyComponent extends Component {
    template(h) {
        //language=html
        return h`
            <div>Hello World</div>
        `
    }
}