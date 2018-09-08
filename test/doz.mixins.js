const Doz = require('../index');
const be = require('bejs');

describe('Doz.global.mixin', function () {

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

            Doz.mixin({
               myMethod() {
                   be.err.equal(this.props.title, 'MR.');
                   return true;
               }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                },

                onCreate() {
                    be.err(done).true(this.myMethod());
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });
        });
    });
});