const Doz = require('../index');
const be = require('bejs');

describe('Doz.on.app.draw', function () {

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
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                },
                onAppDraw(next, prev) {
                    //console.log(next, prev);
                    //next.children[0] = 'ciaooooooooo'
                }
            });

            window.addEventListener('doz@draw', function (event) {
                const next = event.detail.next;
                next.children[0] = next.children[0].replace('Hello', 'Ciao');
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

            setTimeout(function () {
                console.log(document.body.innerHTML);
                done();
            }, 100);

        });
    });
});