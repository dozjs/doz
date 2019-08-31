const Doz = require('../index');
const be = require('bejs');

describe('Doz.directive', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('#1 should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.directive('foo', {
                onComponentCreate(directiveValue) {
                    console.log(directiveValue);
                    done();
                }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d-foo="bar"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

        });

        it('#2 should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.directive(':foo', {
                onComponentCreate(directiveValue) {
                    console.log(directiveValue);
                    done();
                }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d:foo="bar"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

        });

        it('#3 should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.directive(':foo', {
                onSystemAppInit(app) {
                    if (app.shared.foo === 'bar')
                    done();
                }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            new Doz({
                root: '#app',
                shared: {foo: 'bar'},
                template: `
                    <salutation-card
                        d:foo="bar"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

        });

    });
});