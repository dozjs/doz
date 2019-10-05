const Doz = require('../index');
const be = require('bejs');

describe('Doz.show', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                props: {
                    show: false
                },
                template(h) {
                    return h`
                        <div d-ref="myDiv" d-show="${this.props.show}" title="hello">Hello</div>
                    `
                },
                onMount() {
                    setTimeout(() => {
                        be.err.equal(this.ref.myDiv.style.display, 'none');
                        this.props.show = true;
                    }, 50);
                    setTimeout(() => {
                        be.err.equal(this.ref.myDiv.style.display, 'initial');
                        this.props.show = false;
                    }, 70);
                    setTimeout(() => {
                        be.err(done).equal(this.ref.myDiv.style.display, 'none');
                    }, 90);
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