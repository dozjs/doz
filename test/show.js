import Doz from "../src/index.js";
import be from "bejs";

describe('show', function () {

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
                        be.err.equal(this.ref.myDiv.style.display, '');
                        this.props.show = false;
                    }, 200);
                    setTimeout(() => {
                        be.err(done).equal(this.ref.myDiv.style.display, 'none');
                    }, 300);
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