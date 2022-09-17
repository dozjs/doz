import Doz from "../src/index.js";
import be from "bejs";

describe('propsAsArguments', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {
            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('my-cmp', {
                template(h, first, second) {
                    return h`
                        <div>Hello ${first} ${second}</div>
                    `
                }
            });
            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <my-cmp
                            first="Mike"
                            second="Ricali"
                        />
                    `
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err.true(/Mike Ricali/.test(html));
                done();
            },100);
        });
    });
});