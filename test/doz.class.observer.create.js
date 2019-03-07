const Doz = require('../index');
const be = require('bejs');

describe('Doz.class.observer.create', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            new Doz({
                root: '#app',

                propsInitCheck: {
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
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><div> hello suffix3 </div></dz-app></div>')
            }, 500);

        });

        it('should be ok with class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class MyCmp extends Doz.Component {

                constructor(o) {
                    super(o);


                    this.props = {
                        desc: 'hello',
                        title: 'a title',
                        another: 'way'
                    }


                }

                onBeforeMount() {
                    const instance = this;
                    if (instance.propsInitCheck && typeof instance.propsInitCheck === 'object') {
                        //instance.__initChecked = true;
                        (function iterate(rawProps) {
                            let keys = Object.keys(rawProps);
                            for (let i = 0, l = keys.length; i < l; i++) {
                                let property = keys[i];
                                if (rawProps[property] instanceof Object && rawProps[property] !== null) {
                                    iterate(rawProps[property])
                                } else {
                                    if (typeof instance.propsInitCheck[property] === 'function') {
                                        rawProps[property] = instance.propsInitCheck[property].call(instance, rawProps[property]);
                                    }
                                }
                            }
                        })(instance._rawProps);
                    }

                    console.log('onBeforeMount', this.props, this._rawProps)
                }

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }
            }

            /*
            MyCmp.prototype.props = {
                desc: 'hello',
                title: 'a title'
            };
            */

            MyCmp.prototype.propsInitCheck = {
                desc(value) {
                    return value + ' suffix3';
                }
            };

            Doz.define('cmp-x', MyCmp);

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <cmp-x desc="hello2"/>
                    `
                },

                _template(h) {
                    return h`
                        <cmp-x/>
                    `
                }
            });

            setTimeout(() => {
                console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><cmp-x><div> hello suffix3 </div></cmp-x></dz-app></div>')
            }, 500);

        });

    });
});