const Doz = require('../');
const be = require('bejs');

describe('Doz.for', function () {

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

        it('should be loop', function () {

            Doz.component('my-input', {
                template: `
                    <div do-for="item in this.items">
                         <label>{{item.title}}</label>
                         <input type="text" />
                    </div>
                `,
                context: {
                    //message: '',
                    onCreate() {
                        console.log('component created');
                    },
                    onRender() {
                        console.log('component rendered');
                    },
                    onUpdate() {
                        console.log('component updated');
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

            console.log(document.body.innerHTML);
        });

    });
});