const Doz = require('../index');
const be = require('bejs');

describe('properties', function () {

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
                onMount() {
                    be.err(done).equal('SALUTATION-CARD', this.getHTMLElement().nodeName);
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
        });
    });
});