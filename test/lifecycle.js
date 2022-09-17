import Doz from "../src/index.js";
import be from "bejs";

describe('lifecycle', function () {

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
                    return '<div>nested-nested-component</div>';
                },
                onBeforeMount() {
                    //console.log('before mount', this.tag);
                    step++;
                },
                onMount() {
                    //console.log('mount', this.tag);
                    step++;
                },
                onBeforeUnmount() {
                    //console.log('before unmount', this.tag);
                    step++;
                },
                onUnmount() {
                    //console.log('unmount', this.tag);
                    step++;
                }
            });

            Doz.component('nested-component', {
                template() {
                    return '<div>nested component <nested-nested-component></nested-nested-component></div>';
                },
                onBeforeMount() {
                    //console.log('before mount', this.tag);
                    step++;
                },
                onMount() {
                    //console.log('mount', this.tag);
                    step++;
                },
                onBeforeUnmount() {
                    //console.log('before unmount', this.tag);
                    step++;
                },
                onUnmount() {
                    //console.log('unmount', this.tag);
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
                    //console.log('before create');
                    step++;
                },
                onCreate() {
                    //console.log('create');
                    step++;
                },
                onBeforeMount() {
                    //console.log('before mount');
                    step++;
                },
                onMount() {
                    //console.log('mount');
                    step++;
                    setTimeout(() => this.props.salutation = 'Ciao Mondo', 1000);
                },
                onMountAsync() {
                    //console.log('mountAsync');
                    step++;
                },
                onBeforeUpdate(changes) {
                    //console.log('before update', this.props.salutation, changes);
                    step++;
                },
                onUpdate(changes) {
                    //console.log('update', this.props.salutation, changes);
                    step++;
                    setTimeout(() => this.destroy(), 1000)
                },
                onAfterRender() {
                    //console.log('after render');
                    step++;
                },
                onBeforeUnmount() {
                    //console.log('before unmount');
                    step++;
                },
                onUnmount() {
                    //console.log('unmount');
                    step++;
                },
                onBeforeDestroy() {
                    //console.log('before destroy');
                    step++;
                },
                onDestroy() {
                    //console.log('destroy');
                    step++;

                    //console.log('step', step);
                    if (step === 21) done()

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

        it('beforeCreate returns false', function (done) {
            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const MyComponent = class extends Doz.Component {
                template(h) {
                    return h`
                        <div>Hello world</div>
                    `
                }

                onBeforeCreate() {
                    return false;
                }

                onCreate() {
                    throw new Error('onCreate is called')
                }

                onMount() {
                    throw new Error('onMount is called')
                }

                onDestroy() {
                    throw new Error('onDestroy is called')
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <h1>Welcome to my app:</h1>
                        <${MyComponent}/>
                    `
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(html);
                be.err(done).equal(html.trim(), '<div id="app"><dz-app><dz-root><h1>Welcome to my app:</h1><my-component></my-component></dz-root></dz-app></div>')
            }, 100);
        })
    });
});