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
                    <div>
                        hello <b>{{ title }}</b>
                        {{#each(records, record => <div>{{ record.name }}</div>)}}
                    </div>
                </template>
            `;

            Doz.component('salutation-card', {
                template: '#salutation-tpl'
            });

            const view = new Doz({
                root: '#app',
                enableExternalTemplate: true,
                props: {
                    game: 'Mario Bros',
                    records: [
                        {
                            name: 'wow'
                        }
                    ]
                },
                template: `
                    <salutation-card
                        d:id="salutation1"
                        title="MR."
                        records="{{records}}"
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:id="salutation2"
                        title="MRS."
                        records="{{records}}"
                        name="Tina">
                    </salutation-card>
                    <div id="game-name">{{game}}</div>
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