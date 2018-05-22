const Doz = require('../index');
const be = require('bejs');


describe('Doz.appready', function () {

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

    describe('create', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            Doz.component('hello-world', {
                props: {
                    salutation: 'Hello World'
                },
                template() {
                    return `
                        <h2>${this.props.salutation}</h2>
                    `
                },
                onAppReady() {
                    console.log('ready', this.tag);
                    done()
                }
            });

            Doz.component('ciao-mondo', {
                props: {
                    salutation: 'Ciao Mondo'
                },
                template() {
                    return `
                        <h2>${this.props.salutation}</h2>
                    `
                },
                onAppReady() {
                    //console.log('ready', this);
                    done()
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <h1>Welcome to my app:</h1>
                    <hello-world></hello-world>
                `
            });

        });

    });
});