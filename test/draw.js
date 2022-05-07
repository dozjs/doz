const Doz = require('../index');
const be = require('bejs');

describe('Doz.draw', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            let called = false;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            new Doz({
                autoDraw: false,
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            })
                .on('draw', (next, prev) => {
                    if (called) return;
                    console.log(next);
                    called = true;
                    done();
                })
                .draw();
        });

        it('should be ok calling multiple time draw', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            const app = new Doz({
                autoDraw: false,
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            app.draw();
            app.draw();
            app.draw();

            setTimeout(function () {
                const result = document.body.innerHTML;
                console.log(result);
                done();
            },100)
        });
    });
});