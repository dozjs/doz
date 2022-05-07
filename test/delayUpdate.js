const Doz = require('../index');

describe('delayUpdate', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be delay of 1000ms with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('my-delay', {
                delayUpdate: 1000,

                props: {
                    aNumber: 0
                },

                template() {
                    return `
                        <div>Number: ${this.props.aNumber}</div>
                    `
                },

                onMount() {
                    this.props.aNumber = 5;
                },

                onBeforeUpdate() {
                    //console.log('onBeforeUpdate');
                    this.startUpdate = Date.now();
                },

                onUpdate() {
                    const totalTime = Date.now() - this.startUpdate;
                    //console.log('onUpdate', totalTime);
                    if (totalTime >= this.delayUpdate)
                    done();
                }
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <my-delay/>
                    `
                }
            });

        });

        it('should be delay of 1000ms with class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.define('my-delay', class extends Doz.Component {

                constructor(o) {
                    super(o);

                    this.props = {
                        aNumber: 0
                    };

                    this.delayUpdate = 1000;

                }

                template() {
                    return `
                        <div>Number: ${this.props.aNumber}</div>
                    `
                }

                onMount() {
                    this.props.aNumber = 5;
                }

                onBeforeUpdate() {
                    //console.log('onBeforeUpdate');
                    this.startUpdate = Date.now();
                }

                onUpdate() {
                    const totalTime = Date.now() - this.startUpdate;
                    //console.log('onUpdate', totalTime);
                    if (totalTime >= this.delayUpdate)
                        done();
                }
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <my-delay/>
                    `
                }
            });

        });
    });
});