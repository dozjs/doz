import Doz from '../src/index.js'
import be from "bejs"

describe('classObserverCreate', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            new Doz({
                root: '#app',

                propsConvert: {
                    desc: function (value) {
                        return value + ' suffix3';
                    }
                },

                props: {
                    desc: 'hello'
                },

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }
            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><div>hello suffix3</div></dz-app></div>')
            }, 100);

        });

        it('should be ok with class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('cmp-x', class extends Doz.Component {

                constructor(o) {
                    super(o);

                    this.props = {
                        desc: 'hello',
                        title: 'a title',
                        another: 'way'
                    };

                    this.propsConvert = {
                        desc(value) {
                            return value + ' suffix3';
                        }
                    };
                }

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <cmp-x desc="hello"/>
                    `
                },

                _template(h) {
                    return h`
                        <cmp-x/>
                    `
                }
            });

            setTimeout(() => {
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><cmp-x><div>hello suffix3</div></cmp-x></dz-app></div>')
            }, 100);

        });

    });
});