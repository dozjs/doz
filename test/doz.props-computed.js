const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-computed', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with function', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.component('my-computed', {
                props: {
                    aNumber: 0
                },

                propsListener: {
                    aNumber: function (v, old) {
                        result.push(v);
                    }
                },

                propsComputed: {
                    aNumber: function(v) {
                        return v * Math.random();
                    }
                },

                template() {
                    return `
                        <div>Number: ${this.props.aNumber}</div>
                    `
                },

                onMount() {
                    setTimeout(() => this.props.aNumber = 5, 100);
                    setTimeout(() => this.props.aNumber = 7, 200);
                    setTimeout(() => this.props.aNumber = 5, 300);
                    setTimeout(() => this.props.aNumber = 7, 400);
                    setTimeout(() => this.props.aNumber = 8, 500);
                }
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <my-computed/>
                    `
                }
            });

            setTimeout(() => {
                console.log(result);
                //done();
                be.err.true(result[0] === result[2]);
                be.err.true(result[1] === result[3]);
                be.err.true(result[4] !== result[0]);
                be.err.true(result[4] !== result[1]);
                be.err.true(result[4] !== result[3]);
                done();
            }, 600);

        });
    });
});