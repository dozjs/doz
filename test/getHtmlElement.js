import Doz from "../src/index.js";
import be from "bejs";

describe('getHtmlElement', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with function', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <style> 
                            :root {
                                color: red;
                            }
                        </style>
                    `
                },

                onMount() {
                    be.err.not.null(this.getHTMLElement());
                    be.err(done).not.null(this.getHTMLElement());
                }/*,

                onMountAsync() {
                    be.err(done).not.null(this.getHTMLElement());
                }*/
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <salutation-card/>
                    `
                }
            });

        });
    });
});