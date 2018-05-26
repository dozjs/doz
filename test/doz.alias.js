const Doz = require('../index');
const be = require('bejs');

describe('Doz.alias', function () {

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

    describe('create app with component with alias defined', function () {

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
                        d:alias="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:alias="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                    <caller-o d:alias="caller"></caller-o>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                be.err.object(view.getComponent('salutation1'));
                be.err.object(view.getComponent('salutation2'));
                be.err(done).object(view.getComponent('caller'));
            },100);


        });

    });
});