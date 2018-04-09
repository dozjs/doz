const Doz = require('../../index');
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
                    items: [
                        {id: 1, title: 'Buy a car'},
                        {id: 2, title: 'Buy a phone'},
                        {id: 3, title: 'Buy a dog'}
                    ],
                    onCreate() {
                        console.log('component created');
                    },
                    onRender() {
                        console.log('component rendered');
                        this.items[1].title = 'Done, I have get a phone';
                        this.items[2].title = 'Done, I have get a dog';
                    },
                    onUpdate() {
                        //console.log('component updated:', this.items);
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