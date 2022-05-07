const Doz = require('../index');
const be = require('bejs');

describe('is', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('a-component', {
                template() {
                    return `<div id="d-is">hello ${this.props.myTitle}</div>`
                }
            });

            Doz.component('salutation-card', {
                props: {
                    aValue: ''
                },
                template(h) {
                    return h`
                        <span id="d-is" d-is="a-component" my-title="ciao"></span>
                    `
                },

                onMountAsync() {
                    //console.log(document.body.innerHTML);
                    be.err.equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><span data-is="a-component"><div id="d-is">hello ciao</div></span></salutation-card></dz-app></div>')
                    done();
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