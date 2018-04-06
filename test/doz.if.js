const Doz = require('../');
const be = require('bejs');

describe('Doz.if', function () {

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

        it('should be if', function () {

            Doz.component('doz-if-cmp', {
                template: `
                    <div do-if="this.items.length">
                         {{found}}
                    </div>
                    <div do-else>{{notfound}}</div>
                `,
                context: {
                    items: [1,2,3],
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
                    <doz-if-cmp found="trovato" notfound="non trovato"></doz-if-cmp>
                </div>
            `;

            new Doz({
                el: '#app'
            });

            console.log(document.body.innerHTML);
        });

    });
});