const Doz = require('../index');
const be = require('bejs');

describe('Doz.global.mixin', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.mixin({
               myMethod() {
                   be.err.equal(this.props.title, 'MR.');
                   return true;
               }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                },

                onCreate() {
                    be.err(done).true(this.myMethod());
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });
        });

        it('should be ok, method applied to main component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.mixin({
               myMethod() {
                   be.err.equal(this.props.title, 'MR.');
                   return true;
               }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                }
            });

            new Doz({
                root: '#app',
                props: {
                    title: 'MR.'
                },
                template(h)  {
                    return h`
                        <salutation-card
                            title="${this.props.title}"
                            name="Doz">
                        </salutation-card>
                    `
                },
                onCreate() {
                    be.err(done).true(this.myMethod());
                }
            });
        });

        it('should be ok with local mixin', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const objM = {
               myMethod() {
                   be.err.equal(this.props.title, 'MR.');
                   return true;
               }
            };

            Doz.component('salutation-card', {

                mixin: objM,

                template() {
                    return `
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                },

                onCreate() {
                    be.err.empty(this.mixin);
                    be.err(done).true(this.myMethod());
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });
        });

        it('should be ok with local mixin and class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const objM = {
               myMethod() {
                   be.err.equal(this.props.title, 'MR.');
                   return true;
               }
            };

            Doz.define('salutation-card', class extends Doz.Component {

                constructor(o) {
                    super(o);

                    this.config = {
                        mixin: objM
                    }
                }

                template() {
                    return `
                        <div>Hello ${this.props.title} ${this.props.name}</div>
                    `
                }

                onConfigCreate() {
                    be.err.empty(this.mixin);
                    be.err(done).true(this.myMethod());
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });
        });
    });
});