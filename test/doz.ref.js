const Doz = require('../index');
const be = require('bejs');

describe('Doz.ref', function () {

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
                        <div d-ref="myDiv">Hello</div>
                    `
                },
                onMount() {
                    console.log(this.ref.myDiv);
                    be.err(done).domElement(this.ref.myDiv);
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