const {transform} = require('../src/vdom/parser');
const {updateElement} = require('../src/vdom/index');
const html = require('../src/utils/html');
const be = require('bejs');

describe('parser', function () {

    this.timeout(5000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create', function () {
        it('should be return nodes', function () {
            document.body.innerHTML = `<div id="app"></div>`;
            const appRoot = document.getElementById('app');
            const initial = transform(html.create(`
                <div>hello
                    <button disabled>testo</button>
                </div>
                `));

            updateElement(appRoot, initial);
            console.log(document.body.innerHTML);
            const next = transform(html.create(`<div>hello<button disabled>rere</button></div>`));
            //next.children[1].children[0] = 'clicca';
            updateElement(appRoot, next, initial);
            console.log(document.body.innerHTML);
        });
        it('should be return nodes without indent', function () {
            document.body.innerHTML = `<div id="app"></div>`;
            const appRoot = document.getElementById('app');
            const initial = transform(html.create(`
                <div>hello world
                    <button disabled>testo</button>
                    </div>`));

            /*updateElement(appRoot, initial);
            console.log(document.body.innerHTML);
            const next = transform(html.create(`<div>hello<button disabled>rere</button></div>`));
            //next.children[1].children[0] = 'clicca';
            updateElement(appRoot, next, initial);*/
            console.log(initial);
            console.log(document.body.innerHTML);
        });
        it('tree walker', function () {
            document.body.innerHTML = `<div id="app"><span>ciao</span><div><ul><li></li></ul></div></div>`;
            const appRoot = document.getElementById('app');

            console.log(appRoot.children)

            console.log(document.body.innerHTML);
        });


    });
});