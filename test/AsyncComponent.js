const Doz = require('../index');
const be = require('bejs');

describe('Doz.async-component', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const MyPromiseComponent = new Promise((resolve, reject) => {
                setTimeout(() => {
                    const OtherComponent = class extends Doz.Component {
                        template(h) {
                            return h`
                                    <span>Friend</span>
                                `
                        }
                    }
                    OtherComponent.tag = 'other-component';
                    resolve(OtherComponent)
                }, 500)

            });

            class SalutationCard extends Doz.Component {
                template(h) {
                    return h`
                        <div>Hello <${MyPromiseComponent}/></div>
                    `
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                }
            });

            setTimeout(() => {
                console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div>Hello <other-component><span>Friend</span></other-component></div></salutation-card></dz-app></div>')
            }, 1000);
        });

        it('should be ok, simulate esm import', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const MyPromiseComponent = new Promise((resolve, reject) => {
                setTimeout(() => {
                    const OtherComponent = class extends Doz.Component {
                        template(h) {
                            return h`
                                    <span>Friend</span>
                                `
                        }
                    }
                    OtherComponent.tag = 'other-component';
                    resolve({default: OtherComponent})
                }, 500)

            });

            class SalutationCard extends Doz.Component {
                template(h) {
                    return h`
                        <div>Hello <${MyPromiseComponent}/></div>
                    `
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                }
            });

            setTimeout(() => {
                console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div>Hello <other-component><span>Friend</span></other-component></div></salutation-card></dz-app></div>')
            }, 1000);
        });

        it('should be ok, try loading component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const MyPromiseComponent = new Promise((resolve, reject) => {
                setTimeout(() => {
                    const OtherComponent = class extends Doz.Component {
                        template(h) {
                            return h`
                                    <span>Friend</span>
                                `
                        }
                    }
                    OtherComponent.tag = 'other-component';
                    resolve({default: OtherComponent})
                }, 500)

            });

            class MyLoading extends Doz.Component{
                template(h) {
                    return h`<div>Loading...</div>`
                }
            }

            class SalutationCard extends Doz.Component {
                template(h) {
                    return h`
                        <div d-async-loading="${MyLoading}">Hello <${MyPromiseComponent}/></div>
                    `
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                }
            });

            setTimeout(() => {
                console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div>Hello <other-component><span>Friend</span></other-component></div></salutation-card></dz-app></div>')
            }, 1000);
        });
    });
});