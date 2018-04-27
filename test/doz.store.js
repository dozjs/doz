const Doz = require('../index');
const be = require('bejs');

describe('Doz.store', function () {

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

    describe('create view with component with store defined', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                store: 'salutation',
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.component('caller-o', {
                template() {
                    return `<div>${this.props.repeater}</div>`
                },
                onCreate() {
                    console.log(this.getStore('salutation1'));
                    this.getStore('salutation1').name = 'Hi by repeater';
                    this.props.repeater = this.getStore('salutation1').name + ' Teddy'
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        d:store="salutation1"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <salutation-card
                        d:store="salutation2"
                        title="MRS."
                        name="Tina">
                    </salutation-card>
                    <caller-o></caller-o>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                //console.log(view);
                be.err.true(/Hi by repeater</g.test(html));
                be.err.true(/Hi by repeater Teddy</g.test(html));
                be.err(done).true(/MRS. Tina/g.test(html));
            },100);


        });

    });

    describe('create view with component with nested component with store', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('side-bar', {
                template() {
                    return `<div>my side</div>`
                }
            });

            Doz.component('salutation-card', {
                template() {
                    return `<salutation-label>Hello</salutation-label>`
                }
            });

            Doz.component('salutation-label', {
                template() {
                    return `<div>label</div>`
                }
            });

            Doz.component('caller-o', {
                store: 'caller',
                template() {
                    return `<div>I'M CALLER</div>`
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card>
                        <div>bye</div>
                        <caller-o><div>nested</div></caller-o>
                        <caller-o><div>nested</div></caller-o>
                    </salutation-card>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                //console.log(view);
                be.err.true(/nested/g.test(html));
                be.err.true(/bye/g.test(html));
                be.err(done).true(/I'M CALLER/g.test(html));
            },100);
        });
    });
});