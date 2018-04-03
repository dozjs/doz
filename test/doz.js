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
            document.body.innerHTML = `
                <div id="app"></div>`;

            const view = new Doz({
                el: '#app'
            });

            console.log(view);

            be.err.not.null(view);
        });

        it('should be ok with a component', function () {
            Doz.Component('my-component-nested-a', {
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.Component('my-component-a', {
                template: `<div>hello I'm a {{name}} component <my-component-nested-a name="INNESTATO"></my-component-nested-a></div>`
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-a name="Doz"></my-component-a>
                    <my-component-a name="Mike"></my-component-a>
                    <my-component-a name="Jason"></my-component-a>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            const html = document.body.innerHTML;
            //console.log(view);
            console.log(html);

            be.err.true(/Doz/g.test(html));
            be.err.true(/Mike/g.test(html));
            be.err.true(/Jason/g.test(html));
            be.err.true(/INNESTATO/g.test(html));
        });

        it('should be ok, a component with more tags', function () {
            Doz.Component('my-component-nested-b', {
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.Component('my-component-b', {
                template: `<div>hello I'm a <span>{{name}}</span> <span>{{name}}</span> component <my-component-nested-b name="INNESTATO"></my-component-nested-b></div>`
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-b name="Doz"></my-component-b>
                    <my-component-b name="Mike"></my-component-b>
                    <my-component-b name="Jason"></my-component-b>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            const html = document.body.innerHTML;
            //console.log(view);
            console.log(html);

            be.err.true(/Doz/g.test(html));
            be.err.true(/Mike/g.test(html));
            be.err.true(/Jason/g.test(html));
            be.err.true(/INNESTATO/g.test(html));

            //console.log(document.querySelectorAll('div'));
        });

        it('should be ok, update nested', function () {
            Doz.Component('my-component-nested-c', {
                defaultProps: {
                    name: 'sono default name'
                },
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.Component('my-component-c', {
                template: `
                    <div>hello I'm a <span>{{name}}</span> <span>{{name}}</span> component
                        <my-component-nested-c name="{{nested1}}"></my-component-nested-c>
                        <my-component-nested-c name="{{nested2}}"></my-component-nested-c>
                    </div>
                    `
                //template: `<div>hello I'm a <span>{{name}}</span> <span>{{name}}</span> component</div>`
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-c name="Doz" nested1="sono nested1 e tu?"></my-component-c>
                    <my-component-c name="Mike"></my-component-c>
                    <my-component-c name="Jason"></my-component-c>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            const html = document.body.innerHTML;
            //console.log(view);
            console.log(html);

            be.err.true(/Doz/g.test(html));
            be.err.true(/Mike/g.test(html));
            be.err.true(/Jason/g.test(html));
            //be.err.true(/INNESTATO/g.test(html));
            //be.err.true(/INNESTATO2/g.test(html));

            //console.log(view.components[0].__DOZ_INSTANCE__.child[0].__DOZ_INSTANCE__.propsMap.name);
            //console.log(view.components[0].__DOZ_INSTANCE__.propsMap);
            //console.log(view.components);
        });

        it('should be ok with a component and self listener', function () {

            Doz.Component('my-component-button-a', {
                template: `
                    <div>
                        <div>
                            <button on-click="myFunction()">{{title}}</button>
                        </div>
                    </div>
                `,
                context: {
                    myData: {},
                    myFunction: function () {

                    }
                }
            });

            function myFunction() {
                console.log('sssssss');
            }

            document.body.innerHTML = `
                <div id="app">
                    <my-component-button-a title="Click Me"></my-component-button-a>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            const html = document.body.innerHTML;
            //console.log(view);
            console.log(html);

            //console.log(context);

            //document.querySelector('button').click();

            be.err.true(/Click Me/g.test(html));
        });
    });
});