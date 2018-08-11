const Doz = require('../index');
const be = require('bejs');
const template = require('./textures/templates/template1.html');

describe('Doz.external.template', function () {

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

    describe('create app with component template defined', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
                <template id="salutation-tpl">
                    hello <b>{{this.props.title}}</b>
                </template>
            `;

            Doz.component('salutation-card', {
                template: '#salutation-tpl'
            });

            Doz.component('caller-o', {
                template() {
                    return `<div>call me</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                props: {
                    game: 'Mario Bros'
                },
                template: `
                    <salutation-card
                        d:id="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:id="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                    <caller-o d:id="caller"></caller-o>
                    {{this.props.game}}
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                be.err.object(view.getComponentById('salutation1'));
                be.err.object(view.getComponentById('salutation2'));
                be.err(done).object(view.getComponentById('caller'));
            },100);

        });

    });
});