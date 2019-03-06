const Doz = require('../index');
const be = require('bejs');


describe('Doz.app.hooks', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create', function () {

        it('should be ok', function (done) {

            const shouldBe = {
                create: 4,
                mount: 4,
                mountAsync: 4,
                update: 1,
                unmount: 3,
                destroy: 3
            };

            const result = {
                create: 0,
                mount: 0,
                mountAsync: 0,
                update: 0,
                unmount: 0,
                destroy: 0
            };

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            Doz.component('nested-nested-component', {
                template() {
                    return '<div>nested-nested-component</div>';
                }
            });

            Doz.component('nested-component', {
                template() {
                    return '<div>nested component <nested-nested-component></nested-nested-component></div>';
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
                onMount() {
                    setTimeout(() => this.props.salutation = 'Ciao Mondo', 1000);
                },
                onUpdate(changes) {
                    setTimeout(() => this.destroy(), 1000)
                }
            });

            const app = new Doz({
                autoDraw: false,
                root: '#app',
                template: `
                    <h1>Welcome to my app:</h1>
                    <hello-world></hello-world>
                `
            });

            app
                .on('componentCreate', component => {
                    console.log('componentCreate');
                    result.create++;
                })
                .on('componentMount', component => {
                    console.log('componentMount');
                    result.mount++;
                })
                .on('componentMountAsync', component => {
                    console.log('componentMountAsync');
                    result.mountAsync++;
                })
                .on('componentUpdate', (component, changes) => {
                    console.log('componentUpdate', changes);
                    if (changes[0].newValue === 'Ciao Mondo')
                        result.update++;
                })
                .on('componentUnmount', component => {
                    console.log('componentUnmount');
                    result.unmount++;
                })
                .on('componentDestroy', component => {
                    console.log('componentDestroy');
                    result.destroy++;

                });

            app.draw();

            setTimeout(function () {
                be.err(done).equal(result, shouldBe);
            }, 3500);
        });

    });
});