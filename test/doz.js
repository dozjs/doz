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

        it('should be ok with a component', function () {

            Doz.component('my-component', {
                props: {
                    name: 'DOZ'
                },
                template() {
                    return `<div><span>hello I'm a ${this.props.name} component </span></div>`
                },
                onCreate() {
                    console.log('onCreate')
                },
                onRender() {
                    console.log('onRender');
                    this.props.name = 'Fabio Ricali'
                }
            });

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: document.getElementById('app'),
                template: `<div><my-component name="Doz"></my-component></div>`
            });

            const html = document.body.innerHTML;
            //console.log(view);
            console.log(html);

            be.err.true(/Fabio Ricali/g.test(html));

        });
    });
});