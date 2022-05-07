const Doz = require('../index');
const be = require('bejs');

describe('serverSideLoadProps', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            window.DOZ_STORES = {
                'myStore': {
                    title: 'boom'
                }
            }

            document.body.innerHTML = `<div id="app"></div>`;


            Doz.component('salutation-card', {
                props: {
                    title: 'yeah'
                },
                store: 'myStore',
                template(h) {
                    return h`
                        <div>Hello ${this.props.title}</div>
                    `
                }
            });
            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <salutation-card />
                    `
                }
            });

            setTimeout(() => {
                //console.log(document.body.innerHTML);
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div>Hello boom</div></salutation-card></dz-app></div>')
            }, 100);
        });
    });
});