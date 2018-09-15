const Doz = require('../index');
const be = require('bejs');

describe('Doz.on', function () {

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

            let called = false;

            const myPluginAddCiao = function(Doz, app) {
                Doz.mixin({
                    myCiao() {
                        return 'Ciao'
                    }
                });

                app.on('draw', (next, prev) => {
                    if (called) return;
                    console.log(next);
                    called = true;
                    done();
                })
            };

            Doz.use(myPluginAddCiao);

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.myCiao()} ${this.props.title} ${this.props.name}</div>
                    `
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