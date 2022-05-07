const Doz = require('../index');
const be = require('bejs');

describe('Doz.class.observer.loadProps', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            new Doz({
                root: '#app',

                props: {
                    desc: 'hello'
                },

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                },

                onMount() {
                    setTimeout(()=> {
                        this.loadProps({
                            desc: 'ciao'
                        });
                    }, 100);
                }
            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><div>ciao</div></dz-app></div>')
            }, 200);

        });

        it('should be ok with class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('cmp-x', class extends Doz.Component {

                constructor(o) {
                    super(o);

                    this.props = {
                        desc: 'hello'
                    };

                }

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }

                onMount() {
                    setTimeout(()=> {
                        this.loadProps({
                            desc: 'ciao'
                        });
                    }, 100);
                }

            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <cmp-x desc="hello"/>
                    `
                }

            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><cmp-x><div>ciao</div></cmp-x></dz-app></div>')
            }, 100);

        });

        it('should be ok with object definition and propsConvert', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            new Doz({
                root: '#app',

                props: {
                    desc: 'hello'
                },

                propsConvert: {
                    desc(v) {
                        return v + ' suffix'
                    }
                },

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                },

                onMount() {
                    setTimeout(()=> {
                        this.loadProps({
                            desc: 'ciao'
                        });
                    }, 100);
                }
            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><div>ciao suffix</div></dz-app></div>')
            }, 100);

        });

        it('should be ok with class definition and propsConvert', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('cmp-x', class extends Doz.Component {

                constructor(o) {
                    super(o);

                    this.props = {
                        desc: 'hello'
                    };


                    this.propsConvert = {
                        desc(v) {
                            return v + ' suffix'
                        }
                    }

                }

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }

                onMount() {
                    setTimeout(()=> {
                        this.loadProps({
                            desc: 'ciao'
                        });
                    }, 100);
                }

            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <cmp-x desc="hello"/>
                    `
                }

            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><cmp-x><div>ciao suffix</div></cmp-x></dz-app></div>')
            }, 100);

        });

    });
});