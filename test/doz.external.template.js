const Doz = require('../index');
const be = require('bejs');
const template = require('./textures/templates/template1.html');

describe('Doz.external.template', function () {

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

            const view = new Doz({
                root: '#app',
                enableExternalTemplate: true,
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
                    <div id="game-name">{{this.props.game}}</div>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                be.err.true(/<b>MR.<\/b>/.test(html));
                be.err.true(/<b>MRS.<\/b>/.test(html));
                be.err(done).equal('Mario Bros', document.getElementById('game-name').innerHTML);
            },100);

        });

    });
});