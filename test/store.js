const Doz = require('../index');
const be = require('bejs');

describe('store', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component with store defined', function () {

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
                    ////console.log(this.getStore('salutation1'));
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

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(html);
                ////console.log(app);
                be.err.true(/Hi by repeater</g.test(html));
                be.err.true(/Hi by repeater Teddy</g.test(html));
                be.err(done).true(/MRS. Tina/g.test(html));
            }, 100);
        });
    });

    it('should be error, store already defined', function (done) {

        try {
            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                store: 'salutation',
                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.component('caller-o', {
                store: 'salutation',
                template() {
                    return `<div>${this.props.repeater}</div>`
                },
            });

            const app = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <caller-o foo="bar"/>
                `
            });

            done('store is already defined but the error is not thrown');
        } catch (e) {
            done();
        }

    });

    it('store should be destroyed after component destroy', function (done) {

        document.body.innerHTML = `<div id="app"></div>`;

        Doz.component('salutation-card', {
            store: 'salutation',
            template() {
                return `<div>Hello ${this.props.title} ${this.props.name}</div>`
            },

            onMount() {
                if(!this.getStore('salutation')) throw new Error('salutation store is undefined')
                this.destroy();
            }
        });

        const app = new Doz({
            root: '#app',
            template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
        });

        setTimeout(() => {
            be.err(done).undefined(app.getStore('salutation'));
        }, 100);

    });

    it('store should be destroyed after component destroy but with store name defined by tag', function (done) {

        document.body.innerHTML = `<div id="app"></div>`;

        Doz.component('salutation-card', {
            store: 'salutation',
            template() {
                return `<div>Hello ${this.props.title} ${this.props.name}</div>`
            },

            onMount() {
                this.destroy();
            }
        });

        const app = new Doz({
            root: '#app',
            template: `
                    <salutation-card
                        d:store="salutationTag"
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
        });

        setTimeout(() => {
            be.err(done).undefined(app.getStore('salutationTag'));
        }, 100);

    });

    describe('create app with component with nested component with store', function () {

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
                    <span>è uno span</span>
                    <salutation-card>
                        <div>bye</div>
                        <caller-o><div>nested</div></caller-o>
                    </salutation-card>
                `
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(html);
                //console.log(html);
                be.err.true(/nested/g.test(html));
                be.err.true(/bye/g.test(html));
                be.err(done).true(/I'M CALLER/g.test(html));
            }, 100);
        });
    });

    describe('(pattern class) create app with component with store defined', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('salutation-card', class extends Doz.Component {
                constructor(obj) {
                    super(obj);
                    this.store = 'salutation';
                }

                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.define('caller-o', class extends Doz.Component {
                constructor(obj) {
                    super(obj);
                }

                template() {
                    return `<div>${this.props.repeater}</div>`
                }

                onCreate() {
                    ////console.log(this.getStore('salutation1'));
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

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(html);
                ////console.log(app);
                be.err.true(/Hi by repeater</g.test(html));
                be.err.true(/Hi by repeater Teddy</g.test(html));
                be.err(done).true(/MRS. Tina/g.test(html));
            }, 100);

        });

        it('should be ok with default store name', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('salutation-card', class extends Doz.Component {
                constructor(obj) {
                    super(obj);

                    this.config = {
                        store: 'salutation'
                    };

                }

                template() {
                    return `<div>Hello ${this.props.title} ${this.props.name}</div>`
                }
            });

            Doz.define('caller-o', class extends Doz.Component {
                constructor(obj) {
                    super(obj);
                }

                template() {
                    return `<div>${this.props.repeater}</div>`
                }

                onCreate() {
                    ////console.log(this.getStore('salutation'));
                    this.getStore('salutation').name = 'Hi by repeater';
                    this.props.repeater = this.getStore('salutation').name + ' Teddy'
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                    <caller-o></caller-o>
                `
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(html);
                ////console.log(app);
                be.err(done).true(/Hi by repeater Teddy</g.test(html));
            }, 100);

        });

    });
});