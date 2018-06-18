const Doz = require('../index');
const be = require('bejs');

const components = [
    require('./textures/components/id-component'),
    require('./textures/components/label-component'),
    require('./textures/components/wrapper-component')
];

describe('Doz.local.component', function () {

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

    describe('create app with local component', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                components,
                root: '#app',
                template: `
                    <wrapper-component
                        d-alias="first-component"
                        id="12"
                        title="MR."
                        name="Doz">
                    </wrapper-component>
                    <wrapper-component
                        d-alias="second-component"
                        id="34"
                        title="MRS."
                        name="Luis">
                    </wrapper-component>
                `
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                console.log(html);
                console.log(view);
                be.err.true(/Doz/g.test(html));
                be.err(done).true(/Luis/g.test(html));
            }, 100);

        });

    });

    describe('create app with component and sub-component', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            Doz.component('my-component', {
                components,
                template() {
                    return `
                        <wrapper-component
                            d-alias="first-component"
                            id="12"
                            title="MR."
                            name="Doz">
                        </wrapper-component>
                        <wrapper-component
                            d-alias="second-component"
                            id="34"
                            title="MRS."
                            name="Luis">
                        </wrapper-component>
                    `
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <my-component></my-component>
                `
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                console.log(html);
                console.log(view);
                be.err.true(/Doz component/g.test(html));
                be.err(done).true(/Luis component/g.test(html));
            }, 100);

        });

        describe('create app with component and sub-component (2)', function () {

            it('should be ok with a nested component', function (done) {

                document.body.innerHTML = `
                <div id="app"></div>
            `;

                const label = {
                    template() {
                        return `
                            <label>${this.props.name.toUpperCase()}</label>
                        `
                    }
                };

                Doz.component('my-component', {
                    components: {
                        'label-component': label
                    },
                    template() {
                        return `
                        <label-component name="Doz"></label-component>
                        <label-component name="Luis"></label-component>
                    `
                    }
                });

                const view = new Doz({
                    root: '#app',
                    template: `
                    <my-component></my-component>
                `
                });

                setTimeout(() => {
                    const html = document.body.innerHTML;
                    console.log(html);
                    //console.log(view);
                    be.err.true(/DOZ/g.test(html));
                    be.err(done).true(/LUIS/g.test(html));
                }, 100);

            });

        });
    });
});