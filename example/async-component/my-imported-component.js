import {Component} from '../../src/index.js'

class MyImportedComponent extends Component {
    template(h) {
        //language=html
        return h`
            <div>My imported component</div>
        `
    }
}

MyImportedComponent.tag = 'my-imported-component';

export default MyImportedComponent;