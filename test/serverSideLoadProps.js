import Doz from "../src/index.js";
import be from "bejs";

describe('serverSideLoadProps', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    afterEach(function () {
        window.DOZ_STORES = null;
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            window.DOZ_STORES = {
                'myapp-2': {
                    title: 'boom'
                }
            }

            document.body.innerHTML = `<div id="app"></div>`;


            const SalutationCard = class SalutationCard extends Doz.Component {
                constructor(o) {
                    super(o);
                    this.props = {
                        title: 'yeah'
                    }
                }
                template(h) {
                    return h`
                        <div>Hello ${this.props.title}</div>
                    `
                }
            }

            new Doz({
                appId: 'myapp',
                root: '#app',
                template(h) {
                    return h`
                        <${SalutationCard} />
                    `
                },
                onMount() {
                    console.log(window.DOZ_STORES)
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><salutation-card><div>Hello boom</div></salutation-card></dz-app></div>')
                }
            });
        });
    });
});