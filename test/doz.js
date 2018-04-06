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
            Doz.component('my-component-nested-a', {
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.component('my-component-a', {
                template: `<div>hello I'm a {{name}} component <div></div> <my-component-nested-a name="INNESTATO"></my-component-nested-a> <my-component-nested-a name="INNESTATO1"></my-component-nested-a></div>`
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
            Doz.component('my-component-nested-b', {
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.component('my-component-b', {
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
            Doz.component('my-component-nested-c', {
                context: {
                    name: 'sono default name'
                },
                template: `<div onclick="console.log(g)">Ciao nestend: {{name}} component</div>`
            });

            Doz.component('my-component-c', {
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

        it('should be ok with a component and an handler', function () {

            Doz.component('my-component-button-a', {
                template: `
                    <div>
                        <div>
                            <button on-click="myFunction">{{title}}</button>
                        </div>
                    </div>
                `,
                context: {
                    title: 'ciao',
                    myFunction() {
                        this.title = 'altra cosa';
                        console.log(this.element());
                    }
                }
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-button-a title="Click Me"></my-component-button-a>
                </div>
            `;

            const view = new Doz({
                el: '#app'
            });

            const button = document.querySelector('button');

            console.log(document.body.innerHTML);
            be.err.true(/Click Me/g.test(button.innerHTML));
            button.click();
            console.log(document.body.innerHTML);
            be.err.true(/altra cosa/g.test(button.innerHTML));
        });

        it('should be ok with a component and anonymous function', function () {

            Doz.component('my-component-button-b', {
                template: `
                    <div>
                        <div>
                            <button on-click="this.data.p.counter += 1">{{title}} - {{data.p.counter}}</button>: {{other}}
                        </div>
                    </div>
                `,
                context: {
                    data: {
                        p: {
                            counter: 0,
                            other: 4
                        }
                    }
                }
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-button-b title="Click Me"></my-component-button-b>
                </div>
            `;

            new Doz({
                el: '#app'
            });

            const button = document.querySelector('button');

            console.log(document.body.innerHTML);
            be.err.true(/Click Me/g.test(button.innerHTML));
            button.click();
            console.log(document.body.innerHTML);
            be.err.true(/Click Me - 1/g.test(button.innerHTML));
        });

    });
});