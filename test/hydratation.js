import Doz from "../src/index.js";
import be from "bejs";
//import be from "bejs";

describe('hydratation', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            let initial = document.body.innerHTML = `<div id="app"><div title="hello">Hello<child1-child1><div title="child1">Child1</div></child1-child1></div></div>`;
            //document.body.innerHTML = `<div id="app"></div>`;

            class Child1 extends Doz.Component {
                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div title="child1">Child1</div>
                    `
                }
            }

            class Main extends Doz.Component{
                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div title="hello">
                        Hello
                        <${Child1}/>
                        </div>
                    `
                }
            }

            Doz.appCreate('#app', Main);

            setTimeout(() => {
                const html = document.body.innerHTML;
                console.log(html);
                if (initial === html)
                done()
                else
                    throw new Error('mismatch')
                ////console.log(app);
            }, 100);
        });
    });
});