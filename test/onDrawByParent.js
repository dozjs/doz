import Doz from "../src/index.js";

describe('onDrawByParent', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <slot name="header">default header</slot>
                        </div>
                        <div>
                            <slot name="body">default body</slot>
                        </div>
                        <div>
                            <slot name="footer">default footer</slot>
                        </div>
                    `
                },

                onDrawByParent(newNode) {
                    if(newNode.type === 'h1') {
                        newNode.children.push(Doz.compile(`
                            <button id="button-scope">Click</button>
                        `));
                    }
                },

            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div>
                            <salutation-card>
                                <h1 slot="header">Hello</h1>
                                <p slot="body">Lorem Ipsum Dolor Sit</p>
                                <div slot="footer">Copyright</div>
                            </salutation-card>
                        </div>
                    `
                }
            });

            setTimeout(()=>{
                //const html = document.body.innerHTML;
                if (document.getElementById('button-scope'))
                    done()
            },200);
        });
    });
});