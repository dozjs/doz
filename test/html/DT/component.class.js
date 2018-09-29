import {Component, define, component} from '../../../'

class myComponent extends Component {
    constructor(o) {
        super(o);

        this.each([1,2], (item => {}));
    }

    myFunc() {}
}

define('my-tag', {
    props: {},
    v() {
        return true
    }
});