const Doz = require('../index');
const be = require('bejs');

describe('Doz.on.draw.by.parent', function () {

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
                            <button id="button-scope" onclick="scope.completeTest()">Click</button>
                        `));
                    }
                },

                completeTest() {
                    done()
                }
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
                const html = document.body.innerHTML;
                //console.log(html);
                document.getElementById('button-scope').click();
            },200);
        });
    });
});