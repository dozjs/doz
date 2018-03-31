const Doz = require('../');
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
            document.body.innerHTML = `<div id="app"></div>`;

            const view = new Doz({
                el: '#app'
            });

            console.log(view);

            be.err.not.null(view);
        });
        it('should be ok with a component', function () {
            Doz.Component('my-component-nested', {
                tpl: `<div>Ciao nestend: {{name}} component</div>`
            });

            Doz.Component('my-component', {
                tpl: `<div>hello I'm a {{name}} component <my-component-nested name="INNESTATO"></my-component-nested></div>`
            });

            // language=HTML
            document.body.innerHTML = `
                <div id="app">
                    <my-component name="Doz"></my-component>
                    <my-component name="Mike"></my-component>
                    <my-component name="Jason"></my-component>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            //console.log(view);
            console.log(document.body.innerHTML);

            be.err.not.null(view);
        });
    });
});