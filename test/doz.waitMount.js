const Doz = require('../index');
const be = require('bejs');

describe('Doz.waitMount', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('other-tag', {
                template(h) {
                    return h`
                        <div>yeah</div>
                    `
                }
            })

            Doz.component('salutation-card', {
                waitMount: true,
                template(h) {
                    return h`
                        <div>Hello</div>
                        <other-tag></other-tag>
                    `
                },
                onWaitMount() {
                    console.log('onWaitMount')
                    setTimeout(() => {
                        this.runMount();
                    }, 1000)

                },
                onMount() {
                    console.log('onMount')
                }
            });
            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <salutation-card />
                    `
                },
                onAppReady() {
                    //console.log(this.app._onAppComponentsMounted.size)
                    /*setInterval(() => {
                        this.app._onAppComponentsMounted.forEach(item => console.log(item))
                    },50)*/

                    //console.log('onComponentsMounted')
                    done();
                }
            });
        });
    });
});