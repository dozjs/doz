class Component {

    constructor() {

    }

    static define() {

    }

}

class Doz {
    constructor(cfg, Cmp) {
        this.cmp = new Cmp();
        console.log(this.cmp.template());
    }
}

function h(str) {

}

class MyComponent extends Component{

    constructor() {
        super();
        this.props = {
            name: 'Mondo'
        };
    }

    template() {
        return h`
            <div>
                ciao ${this.props.name}
            </div>
        `
    }

    onMount() {

    }
}

Component.define('my-component', MyComponent);

new Doz({
    root: '#app'
}, class extends Component {
    template() {
        return `<my-component></my-component>`
    }
});

console.log(MyComponent.prototype.onMount)