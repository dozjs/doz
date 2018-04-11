const Doz = require('../index');
const be = require('bejs');

describe('Doz', function () {

    this.timeout(5000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create basic', function () {
        it('should be ok', function () {

            // language=HTML
            document.body.innerHTML = `
                <div id="app"></div>`;

            const view = new Doz({
                el: '#app'
            });

            console.log(view);

            be.err.not.null(view);
        });

        it('should be ok with a component', function (done) {

            Doz.component('my-component', {
                template() {
                    return `
                        <div>
                            <span>hello I'm a ${this.props.name} component </span>
                        </div>`
                },
                onCreate() {
                    console.log('onCreate')
                },
                onRender() {
                    console.log('onRender');
                    this.props.name = 'D O Z'
                }
            });

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: document.getElementById('app'),
                template: `<div><my-component name="Doz"></my-component></div>`
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);

                be.err(done).true(/D O Z/g.test(html));
            },100);


        });

        it('should be ok with a nested component', function (done) {

            Doz.component('my-id', {
                template() {
                    return `
                        <span>ID TEST</span>`
                }
            });

            Doz.component('my-label', {
                template() {
                    return `
                        <span><my-id></my-id> MR.</span>`
                }
            });

            Doz.component('my-component', {
                template() {
                    return `
                        <div>
                            <span>hello I'm <my-label></my-label> ${this.props.name} component </span>
                        </div>`
                },
                onCreate() {
                    console.log('onCreate')
                },
                onRender() {
                    console.log('onRender');
                    this.props.name = 'D O Z'
                }
            });

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: document.getElementById('app'),
                template: `<div><my-component name="Doz"></my-component><my-component name="Luis"></my-component></div>`
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);

                be.err(done).true(/D O Z/g.test(html));
            },100);


        });
    });
});