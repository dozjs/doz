const Doz = require('../index');
const be = require('bejs');

describe('Doz.waitMount', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                waitMount: true,
                template(h) {
                    return h`
                        <div>Hello</div>
                    `
                },
                onWaitMount() {
                    console.log('onWaitMount')
                    setTimeout(() => {
                        this.runMount();
                    }, 1000)

                },
                onMount() {
                    console.log('onMount')
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });
    });
});