const Doz = require('../index');
const be = require('bejs');

describe('id', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component with id defined', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.component('caller-o', {
                template() {
                    return `<div>call me</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d:id="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:id="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                    <caller-o d:id="caller"></caller-o>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                ////console.log(html);
                be.err.object(view.getComponentById('salutation1'));
                be.err.object(view.getComponentById('salutation2'));
                be.err(done).object(view.getComponentById('caller'));
            },100);


        });

        it('should be remove global id after component destroy', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                },

                onMount() {
                    this.destroy();
                }
            });

            const app = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d:id="salutation"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            setTimeout(()=>{
                be.err(done).undefined(app.getComponentById('salutation'));
            },100);


        });

    });

    describe('(pattern class) create app with component with id defined', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('salutation-card', class extends Doz.Component {
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.define('caller-o', class extends Doz.Component {
                template() {
                    return `<div>call me</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d:id="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:id="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                    <caller-o d:id="caller"></caller-o>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                ////console.log(html);
                be.err.object(view.getComponentById('salutation1'));
                be.err.object(view.getComponentById('salutation2'));
                be.err(done).object(view.getComponentById('caller'));
            },100);


        });

        it('should be ok with a nested component and default id', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('salutation-card', class extends Doz.Component {

                constructor(obj) {
                    super(obj);
                    this.config = {
                        id: 'salutation'
                    }
                }

                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.define('caller-o', class extends Doz.Component {
                template() {
                    return `<div>call me</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <caller-o d:id="caller"></caller-o>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                ////console.log(html);
                be.err.object(view.getComponentById('salutation'));
                be.err(done).object(view.getComponentById('caller'));
            },100);


        });

    });
});