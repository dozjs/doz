const Doz = require('../index');

describe('waitMount', function () {

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
                async onWaitMount() {
                    //console.log('onWaitMount')
                    await new Promise(resolve => {
                        setTimeout(() => {
                            resolve()
                        }, 1000)
                    })
                    this.runMount();
                },
                onMount() {
                    //console.log('onMount')
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
                    //console.log('onAppReady')
                    ////console.log(this.app._onAppComponentsMounted.size)
                    /*setInterval(() => {
                        this.app._onAppComponentsMounted.forEach(item => //console.log(item))
                    },50)*/

                    ////console.log('onComponentsMounted')
                    done();
                }
            });
        });

        it('should be ok with doz.mount', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('other-tag', {
                waitMount: true,
                template(h) {
                    return h`
                        <div>yeah</div>
                    `
                },
                async onWaitMount() {
                    //console.log('onWaitMount')
                    await new Promise(resolve => {
                        setTimeout(() => {
                            resolve()
                        }, 1000)
                    })
                    this.runMount();
                },
                onMount() {
                    //console.log('onMount')
                }
            })

            Doz.component('salutation-card', {

                template(h) {
                    return h`
                        <div>Hello</div>
                        <other-tag></other-tag>
                    `
                }
            });
            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div></div>
                    `
                },
                onMount() {
                    this.mount(this.h`<salutation-card></salutation-card>`)
                },
                onAppReady() {
                    //console.log('onAppReady')
                    //console.log(document.body.innerHTML);
                    done();
                }
            });
        });
    });
});