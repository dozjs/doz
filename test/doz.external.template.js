const Doz = require('../index');
const be = require('bejs');
const template = require('./textures/templates/template1.html');

describe('Doz.external.template', function () {

    this.timeout(5000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component with id defined', function () {

        it('should be ok with a nested component', function () {

            console.log(template);

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

        });

    });
});