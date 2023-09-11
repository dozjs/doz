import Doz from "../src/index.js";
import be from "bejs";

describe('propsOutsideConstructor', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class Child1 extends Doz.Component {
                props = {
                    title: 'hello'
                }
                template(h) {
                    return h`
                        <div title="child1">${this.props.title}</div>
                    `
                }
            }

            class Main extends Doz.Component{
                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div>
                            <${Child1} title="ciao"/>
                        </div>
                    `
                }

                onMount() {
                    console.log(document.body.innerHTML);
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><div><child1-child1><div title="child1">ciao</div></child1-child1></div></div>')
                }
            }

            Doz.appCreate('#app', Main);

        });

        it('should be ok with default prop', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class Child1 extends Doz.Component {
                props = {
                    title: 'hello'
                }
                template(h) {
                    return h`
                        <div title="child1">${this.props.title}</div>
                    `
                }
            }

            class Main extends Doz.Component{
                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div>
                            <${Child1}/>
                        </div>
                    `
                }

                onMount() {
                    console.log(document.body.innerHTML);
                    be.err(done).equal(document.body.innerHTML, '<div id="app"><div><child1-child1><div title="child1">hello</div></child1-child1></div></div>')
                }
            }

            Doz.appCreate('#app', Main);

        });
    });
});