const Doz = require('../index');
const be = require('bejs');

describe('Doz.animate', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with d-animate as string', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div d-ref="myDiv" d-animate="fadeIn" title="hello">Hello</div>
                    `
                },
                onMount() {
                    setTimeout(() => {
                        be.err.equal(this.ref.myDiv.__animationDirectiveValue, {
                            show: {name: 'fadeIn'},
                            hide: {name: 'fadeIn'}
                        });
                        done();
                    }, 50);
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });

        it('should be ok with d-animate as object with show and hide properties', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div d-ref="myDiv" d-animate="${{show: 'fadeIn', hide: 'fadeIn'}}" title="hello">Hello</div>
                    `
                },
                onMount() {
                    setTimeout(() => {
                        be.err.equal(this.ref.myDiv.__animationDirectiveValue, {
                            show: {name: 'fadeIn'},
                            hide: {name: 'fadeIn'}
                        });
                        done();
                    }, 50);
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });
    });
});