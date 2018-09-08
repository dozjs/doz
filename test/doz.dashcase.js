const Doz = require('../index');
const be = require('bejs');

describe('Doz.dashcase.prop', function () {

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

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                },
                onUpdate() {
                    console.log(this.props)
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        my-title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            //setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                be.err(done).true(/MR\. Doz/g.test(html));
            //},100);
        });
    });
});