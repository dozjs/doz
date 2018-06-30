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

            Doz.component('nested-nested-component', {
                template() {
                    return 'nested-nested-component';
                },
                onBeforeMount() {
                    console.log('before mount', this.tag);
                    step++;
                },
                onMount() {
                    console.log('mount', this.tag);
                    step++;
                },
                onBeforeUnmount() {
                    console.log('before unmount', this.tag);
                    step++;
                },
                onUnmount() {
                    console.log('unmount', this.tag);
                    step++;
                }
            });

            Doz.component('nested-component', {
                template() {
                    return '<div>nested component <nested-nested-component></nested-nested-component></div>';
                },
                onBeforeMount() {
                    console.log('before mount', this.tag);
                    step++;
                },
                onMount() {
                    console.log('mount', this.tag);
                    step++;
                },
                onBeforeUnmount() {
                    console.log('before unmount', this.tag);
                    step++;
                },
                onUnmount() {
                    console.log('unmount', this.tag);
                    step++;
                }
            });

            Doz.component('hello-world', {
                props: {
                    salutation: 'Hello World'
                },
                template() {
                    return `
                        <h2>${this.props.salutation}</h2>
                        <nested-component></nested-component>
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
                onBeforeMount() {
                    console.log('before mount');
                    step++;
                },
                onMount() {
                    console.log('mount');
                    step++;
                    setTimeout(() => this.props.salutation = 'Ciao Mondo', 1000);
                },
                onMountAsync() {
                    console.log('mountAsync');
                    step++;
                },
                onBeforeUpdate(changes) {
                    console.log('before update', this.props.salutation, changes);
                    step++;
                },
                onUpdate(changes) {
                    console.log('update', this.props.salutation, changes);
                    step++;
                    setTimeout(() => this.destroy(), 1000)
                },
                onBeforeUnmount() {
                    console.log('before unmount');
                    step++;
                },
                onUnmount() {
                    console.log('unmount');
                    step++;
                },
                onBeforeDestroy() {
                    console.log('before destroy');
                    step++;
                },
                onDestroy() {
                    console.log('destroy');
                    step++;

                    console.log('step', step);
                    if (step === 19) done()

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