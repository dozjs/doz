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

            new Doz({
                root: '#app',
                template: `
                    <h1>Welcome to my app:</h1>
                    <hello-world></hello-world>
                `
            });

        });

        it('should be empty array queue', function (done) {

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
                onRender() {
                    setTimeout(() => {
                        this.destroy();
                    },1000)
                },
                onAppReady() {
                    console.log('ready')
                }
            });

            const app = new Doz({
                root: '#app',
                template: `
                    <h1>Welcome to my app:</h1>
                    <hello-world></hello-world>
                `
            });


            setTimeout(()=>{
                //app._onAppReadyCB = []
                be.err(done).equal(0, app._onAppReadyCB.length)
            },1500);

        });

    });
});