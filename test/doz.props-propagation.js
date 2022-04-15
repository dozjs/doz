const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-propagation', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok #1', function (done) {
            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component{

                constructor(o) {
                    super(o);
                    this.propsPropagation = true;
                }

                template(h) {
                    return h`
                        <${SalutationCardInner}/>
                    `
                }

                onMount() {
                    this.props.name = 'Ipsum';
                }
            }

            class SalutationCardInner extends Doz.Component{

                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div>Hello ${this.props.name}</div>
                    `
                }

                onUpdate() {
                    if (this.props.name === 'Ipsum')
                        done()
                }
            }

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <${SalutationCard}
                            name="Doz">
                        </>
                    `
                }
            });


        });

        it('should be ok #2', function (done) {
            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component{

                constructor(o) {
                    super(o);
                    this.propsPropagation = true;
                }

                template(h) {
                    return h`
                        <${SalutationCardInner} d:no-propagation/>
                    `
                }

                onMount() {
                    this.props.name = 'Ipsum';
                }
            }

            class SalutationCardInner extends Doz.Component{

                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div>Hello ${this.props.name}</div>
                    `
                }

            }

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <${SalutationCard}
                            name="Doz">
                        </>
                    `
                }
            });

            setTimeout(() => {
                console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><salutation-card-inner><div>Hello undefined</div></salutation-card-inner></salutation-card></dz-app></div>')
            }, 1000);
        });
    });
});