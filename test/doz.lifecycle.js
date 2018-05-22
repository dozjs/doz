const Doz = require('../index');
const be = require('bejs');


describe('Doz.lifecycle', function () {

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

            let step = 0;

            Doz.component('hello-world', {
                props: {
                    salutation: 'Hello World'
                },
                template() {
                    return `
                        <h2>${this.props.salutation}</h2>
                    `
                },
                onBeforeCreate() {
                    console.log('before create');
                    step++;
                },
                onCreate() {
                    console.log('create');
                    step++;
                },
                onRender() {
                    console.log('render');
                    step++;
                    setTimeout(()=> this.props.salutation = 'Ciao Mondo', 1000);
                },
                onBeforeUpdate() {
                    console.log('before update', this.props.salutation);
                    step++;
                },
                onUpdate() {
                    console.log('update', this.props.salutation);
                    step++;
                    setTimeout(()=> this.destroy(), 1000)
                },
                onBeforeDestroy() {
                    console.log('before destroy');
                    step++;
                },
                onDestroy() {
                    console.log('destroy');
                    step++;
                    if (step === 7)
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