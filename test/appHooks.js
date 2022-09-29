import Doz from '../src/index.js'
import be from "bejs"

describe('hooks', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create', function () {

        it('should be ok', function (done) {

            const shouldBe = {
                create: 4,
                propsInit: 4,
                mount: 4,
                mountAsync: 4,
                update: 1,
                unmount: 3,
                destroy: 3
            };

            const result = {
                create: 0,
                propsInit: 0,
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
                template(h) {
                    return h`<div>nested-nested-component</div>`;
                }
            });

            Doz.component('nested-component', {
                template(h) {
                    return h`<div>nested component <nested-nested-component></nested-nested-component></div>`;
                }
            });

            Doz.component('hello-world', {
                props: {
                    salutation: 'Hello World'
                },
                template(h) {
                    return h`
                        <h2>${this.props.salutation}</h2>
                        <nested-component></nested-component>
                    `
                },
                onMount() {
                    setTimeout(() => this.props.salutation = 'Ciao Mondo', 1000);
                    //console.log(this.tag, Object.keys(this.children).length)
                },
                /*onMountAsync() {
                    console.log(this.children)
                },*/
                onUpdate(changes) {
                    setTimeout(() => this.destroy(), 1000)
                }
            });

            const app = new Doz({
                autoDraw: false,
                root: '#app',
                template(h) {
                    return h`
                        <h1>Welcome to my app:</h1>
                        <hello-world></hello-world>
                    `
                }
            });

            app
                .on('componentCreate', component => {
                    //console.log('componentCreate');
                    result.create++;
                })
                .on('componentPropsInit', component => {
                    //console.log('componentPropsInit');
                    result.propsInit++;
                })
                .on('componentMount', component => {
                    //console.log('componentMount');
                    result.mount++;
                })
                .on('componentMountAsync', component => {
                    //console.log('componentMountAsync');
                    result.mountAsync++;
                })
                .on('componentUpdate', (component, changes) => {
                    //console.log('componentUpdate', changes);
                    if (changes[0].newValue === 'Ciao Mondo')
                        result.update++;
                })
                .on('componentUnmount', component => {
                    //console.log('componentUnmount');
                    result.unmount++;
                })
                .on('componentDestroy', component => {
                    //console.log('componentDestroy');
                    result.destroy++;

                });

            app.draw();

            setTimeout(function () {
                //console.log(result)
                //console.log(shouldBe)
                be.err(done).equal(result, shouldBe);
            }, 3500);
        });

    });
});