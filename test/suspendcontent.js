import Doz from '../src/index.js'
import be from "bejs";

describe('suspendcontent', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with property defined inside class', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component {
                suspendcontent = true;
                //language=html
                template(h) {
                    return h`
                        <div>
                            <div>hello</div>
                            <div>world</div>
                        </div>
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
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
            }, 1000);
        });

        it('should be ok with property defined inside constructor class', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component {
                constructor(o) {
                    super(o);
                    this.suspendcontent = true;
                }

                //language=html
                template(h) {
                    return h`
                        <div>
                            <div>hello</div>
                            <div>world</div>
                        </div>
                    `
                }
                onMount() {
                    console.log(this)
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
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
            }, 1000);
        });

        it('should be ok with property defined inside object', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const SalutationCard = {
                tag: 'salutation-card',
                suspendcontent: true,
                //language=html
                template(h) {
                    return h`
                        <div>
                            <div>hello</div>
                            <div>world</div>
                        </div>
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
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
            }, 1000);
        });

        it('should be ok with property via prop', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component {
                //language=html
                template(h) {
                    return h`
                        <div>
                            <div>hello</div>
                            <div>world</div>
                        </div>
                    `
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} suspendcontent/>
                    `
                }
            });

            setTimeout(() => {
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
            }, 1000);
        });
    });
});