import Doz from "../src/index.js";
import be from "bejs";

describe('Doz', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create basic', function () {
        it('should be ok', function () {

            // language=HTML
            document.body.innerHTML = `
                <div id="app"></div>`;

            const view = new Doz({
                root: document.getElementById('app'),
                template: ''
            });

            ////console.log(view);

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
                    //console.log('onCreate')
                },
                onMount() {
                    //console.log('onMount');
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

            ////console.log(app.components);

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);

                be.err(done).true(/D O Z/g.test(html));
            },100);

        });

        it('should be ok with a nested component', function (done) {

            Doz.component('my-id', {
                template() {
                    return `<span>${this.props.number}</span>`
                }
            });

            Doz.component('my-label', {
                template() {
                    return `<span><my-id number="${this.props.id}"></my-id> ${this.props.title}</span>`
                }
            });

            Doz.component('my-component', {
                template() {
                    return `
                        <div>
                            <span>hello I'm <my-label id="${this.props.id}" title="${this.props.title}"></my-label> ${this.props.name} component </span>
                        </div>`
                },
                onCreate() {
                    //console.log('onCreate')
                }
            });

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: document.getElementById('app'),
                template: `
                                <my-component
                                    id="12"
                                    title="MR."
                                    name="Doz">
                                </my-component>
                                <my-component
                                    id="34"
                                    title="MRS."
                                    name="Luis">
                                </my-component>
                           `
            });

            ////console.log(app._usedComponents);
            ////console.log(app.getComponent('second-component'));
            ////console.log(app.getComponent());

            setTimeout(()=>{
                const html = document.body.innerHTML;
                ////console.log(html);

                be.err.true(/Doz/g.test(html));
                be.err(done).true(/Luis/g.test(html));
            },100);


        });

        it('should be ok without component', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: document.getElementById('app'),
                template: `<div><h2>without component</h2></div>`
            });

            //console.log(view._usedComponents);

            setTimeout(()=>{
                const html = document.body.innerHTML;
                ////console.log(html);

                be.err(done).true(/without component/g.test(html));
            },100);

        });

        it('should be ok with a selector', function (done) {

            Doz.component('my-component', {
                template() {
                    return `
                        <div>
                            <span>hello I'm a ${this.props.name} component </span>
                        </div>`
                },
                onCreate() {
                    //console.log('onCreate')
                },
                onMount() {
                    //console.log('onMount');
                    this.props.name = 'D O Z';
                }
            });

            document.body.innerHTML = ' \
                <script id="template" type="text/template">  \
                    <div><my-component name="Doz"></my-component></div> \
                </script> \
                <div id="app"></div> \
            ';

            const view = new Doz({
                root: '#app',
                template: '#template'
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);

                be.err(done).true(/D O Z/g.test(html));
            },100);

        });

        it('appRoot should be equal', function () {

            // language=HTML
            document.body.innerHTML = `
                <div id="app"></div>`;

            const view = new Doz({
                root: document.getElementById('app'),
                template() {
                    return `<div>ciao</div>`
                },
                onMount() {
                    be.err.equal(this.appRoot.id, 'app');
                }
            });

        });

        it('mainComponent should be equal to _tree', function () {

            // language=HTML
            document.body.innerHTML = `
                <div id="app"></div>`;

            const view = new Doz({
                root: document.getElementById('app'),
                template() {
                    return `<div>ciao</div>`
                },
                onMount() {
                    be.err.equal(this.app.mainComponent, this.app._tree);
                }
            });

        });
    });
});