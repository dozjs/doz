const Doz = require('../index');
const be = require('bejs');

describe('Doz.on.app.draw', function () {

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
                    console.log(next, prev);
                    next.children[0] = 'Ciao'
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

            setTimeout(function () {
                console.log(document.body.innerHTML);
                done();
            }, 100);

        });
    });
});