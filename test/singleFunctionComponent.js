const Doz = require('../index');

describe('singleFunctionComponent', function () {

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

        it.skip('should be ok, simulate babel transform class to function', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class A {}

            const instance = new A();

            Doz.component('salutation-card', function () {
                if (!(instance instanceof A)) { throw new TypeError("Cannot call a class as a function"); }
                return `
                    <div>${this.props.title} ${this.props.name}</div>
                `
            });

            try {

                new Doz({
                    root: '#app',
                    template: `
                    <div>
                    <salutation-card
                        title="MR."
                        name="Doz" />
                        </div>
                `
                });
            } catch (e) {
                done();
            }

        });

    });
});