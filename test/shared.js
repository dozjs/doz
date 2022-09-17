import Doz from "../src/index.js";
import be from "bejs";

describe('shared', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with shared object', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('x-parent', {
                template(h) {
                    return h`
                        <div>
                            <x-child-a/>
                            <x-child-b/>
                        </div>`
                }
            });

            Doz.component('x-child-a', {
                onCreate() {
                    this.shared.otherThing = 'hello';
                    be.err.object(this.shared);
                },
                template() {
                    return `<div>child a</div>`
                }
            });

            Doz.component('x-child-b', {
                onCreate() {
                    be.err.object(this.shared);
                    be.err.equal(this.shared.otherThing, 'hello');
                },
                template() {
                    return `<div>child b</div>`
                }
            });

            const app = new Doz({
                shared: {
                    myObject: {
                        foo: 'bar'
                    }
                },
                root: '#app',
                template: `
                    <div>
                        <x-parent/>
                    </div>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                //console.log(app.shared);
                be.err(done).object(app.shared);
            },100);


        });

    });
});