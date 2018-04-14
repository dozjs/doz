const Doz = require('../index');
const be = require('bejs');

describe('Doz.store', function () {

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

    describe('create view with component with store defined', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                store: 'salutation',
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d-store="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d-store="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                //console.log(view);
                be.err.true(/MR. Doz/g.test(html));
                be.err(done).true(/MRS. Tina/g.test(html));
            },100);


        });

    });
});