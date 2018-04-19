const Doz = require('../index');
const be = require('bejs');

const actions = {
    updateTitle(title, name) {
        const store = this.getStore('salutation');
        store.title = title;
        store.name = name;
    }
};

describe('Doz.actions', function () {

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

    describe('create view with actions', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                store: 'salutation',
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                },
                onRender() {
                    this.action.updateTitle('Dear', 'Teddy');
                }
            });


            const view = new Doz({
                root: '#app',
                actions,
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                //console.log(view);
                be.err(done).true(/Hello Dear Teddy</g.test(html));
            },100);


        });

    });
});