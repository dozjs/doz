import Doz from '../src/index.js'
import be from "bejs";

const MyComponent = {
    tag: 'my-component',
    props: {
        text: ''
    },
    template(h) {
        return h`<div>${this.props.text}</div>`;
    }
}

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
                            <${MyComponent} text="hello"/>
                            <${MyComponent} text="world"/>
                        </div>
                    `
                }
                onMount() {
                    // console.log('suspendedNodes', this.suspendedNodes)
                    if (this.suspendedNodes.length !== 1) {
                        throw new Error('suspendedNodes length should be  1')
                    }
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                },
                onMount() {
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
                }
            });
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
                            <${MyComponent} text="hello"/>
                            <${MyComponent} text="world"/>
                        </div>
                    `
                }
                onMount() {
                    // console.log('suspendedNodes', this.suspendedNodes)
                    if (this.suspendedNodes.length !== 1) {
                        throw new Error('suspendedNodes length should be  1')
                    }
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                },
                onMount() {
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
                }
            });
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
                            <${MyComponent} text="hello"/>
                            <${MyComponent} text="world"/>
                        </div>
                    `
                },
                onMount() {
                    // console.log('suspendedNodes', this.suspendedNodes)
                    if (this.suspendedNodes.length !== 1) {
                        throw new Error('suspendedNodes length should be  1')
                    }
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                },
                onMount() {
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
                }
            });
        });

        it('should be ok with property via prop', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component {
                //language=html
                template(h) {
                    return h`
                        <div>
                            <${MyComponent} text="hello"/>
                            <${MyComponent} text="world"/>
                        </div>
                    `
                }
                onMount() {
                    // console.log('suspendedNodes', this.suspendedNodes)
                    if (this.suspendedNodes.length !== 1) {
                        throw new Error('suspendedNodes length should be  1')
                    }
                }
            }

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} suspendcontent/>
                    `
                },
                onMount() {
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div></div></salutation-card></dz-app></div>')
                }
            });
        });
    });
});