const Doz = require('../../index');
const be = require('bejs');

describe('Doz.event', function () {

    this.timeout(5000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create basic', function () {

        it('should be ok with a component events', function (done) {

            let isCreated, isRendered, beforeUpdate;

            Doz.component('my-component-button-c', {
                template: `
                    <div>
                        <div>
                            <button on-click="this.counter += 1">{{title}} - {{counter}}</button>
                        </div>
                    </div>
                `,
                context: {
                    counter: 0,
                    onCreate() {
                        console.log('component created');
                        isCreated = true;
                    },
                    onRender() {
                        console.log('component rendered');
                        isRendered = true;
                    },
                    onBeforeUpdate() {
                        console.log('component before update');
                        beforeUpdate = true;
                    },
                    onUpdate() {
                        console.log('component updated');
                        if(isCreated && isRendered && beforeUpdate)
                            done();
                    }
                }
            });

            document.body.innerHTML = `
                <div id="app">
                    <my-component-button-c title="Click Me"></my-component-button-c>
                </div>
            `;

            new Doz({
                el: '#app'
            });

            const button = document.querySelector('button');
            button.click();
        });
    });
});