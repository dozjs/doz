const Doz = require('../index');
const be = require('bejs');

describe('Doz.single.function.component', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', function (h) {
                return h`
                    <div>${this.props.title} ${this.props.name}</div>
                `
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz" />
                `
            });

            if(/MR. Doz/g.test(document.body.innerHTML))
                done();
        });

    });
});