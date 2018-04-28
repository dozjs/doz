const Doz = require('../index');
const be = require('bejs');

describe('Doz.callback', function () {

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

    describe('create view with component callback', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name} <caller-o d:on-mycallback="aCallback"></caller-o></div>`
                },
                aCallback: function(arg) {
                    console.log('callback is called', arg);
                    be.err(done).equal(arg, 'hello');
                }
            });

            Doz.component('caller-o', {
                template() {
                    return `<div>Callback</div>`
                },
                onCreate() {
                    setTimeout(()=>{
                        this.emit('mycallback', 'hello');
                    },1000);
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

            console.log(document.body.innerHTML)
        });
    });
});