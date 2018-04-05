const Doz = require('../');
const be = require('bejs');

describe('Doz.model', function () {

    this.timeout(5000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        Doz.collection.removeAll();
        document.body.innerHTML = '';
    });

    describe('create basic', function () {

        it('should be change', function (done) {

            Doz.Component('my-input', {
                template: `
                    <div>
                         <input type="text" do-model="message" />
                    </div>
                `,
                context: {
                    message: '',
                    onCreate() {
                        console.log('component created');
                    },
                    onRender() {
                        console.log('component rendered');
                        const input = this.element().querySelector('input');
                        input.value = 'hello world';

                        // Simulating changes by human
                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        input.dispatchEvent(evt);
                        input.fireEvent('onchange');
                    },
                    onUpdate() {
                        console.log('component updated', this.message);
                        if (this.message === 'hello world')
                            done();
                    }
                }
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-input></my-input>
                </div>
            `;

            new Doz({
                el: '#app'
            });

        });

        it('should be change, nested data', function (done) {

            Doz.Component('my-input', {
                template: `
                    <div>
                         <input type="text" do-model="data.message" />
                    </div>
                `,
                context: {
                    data: {
                        message: 'mmm'
                    },
                    onCreate() {
                        console.log('component created');
                    },
                    onRender() {
                        console.log('component rendered');
                        const input = this.element().querySelector('input');
                        input.value = 'hello world';

                        //console.log('INPUT',input)
                        // Simulating changes by human
                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        input.dispatchEvent(evt);
                        input.fireEvent('onchange');
                    },
                    onUpdate() {
                        console.log('component updated', this.data.message);
                        if (this.data.message === 'hello world')
                            done();
                    }
                }
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-input></my-input>
                </div>
            `;

            new Doz({
                el: '#app'
            });

        });
    });
});