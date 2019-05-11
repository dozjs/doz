const {compile} = require('../src/vdom/parser');
const {updateElement} = require('../src/vdom/index');
const html = require('../src/utils/html');
const be = require('bejs');
const DOM = require('../src/component/DOM');

describe('parser', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create', function () {
        it('should be return nodes', function () {
            document.body.innerHTML = `<div id="app"></div>`;
            const fakeCmp = new DOM();
            const appRoot = document.getElementById('app');
            const initial = compile(`
                <div>hello
                    <button disabled>testo</button>
                </div>
                `);

            updateElement(appRoot, initial, null, 0, fakeCmp);
            console.log(document.body.innerHTML);
            const next = compile(`<div>hello<button disabled>rere</button></div>`);
            //next.children[1].children[0] = 'clicca';
            updateElement(appRoot, next, initial, 0, fakeCmp);
            console.log(document.body.innerHTML);
        });
        it('should be return nodes without indent', function () {
            document.body.innerHTML = `<div id="app"></div>`;
            const appRoot = document.getElementById('app');
            const initial = compile(`
                <div>hello world
                    <button disabled>testo</button>
                    </div>`);

            /*updateElement(appRoot, initial);
            console.log(document.body.innerHTML);
            const next = transform(html.create(`<div>hello<button disabled>rere</button></div>`));
            //next.children[1].children[0] = 'clicca';
            updateElement(appRoot, next, initial);*/
            console.log(initial);
            console.log(document.body.innerHTML);
        });
        it('tree walker', function () {

            const collections = {
                'doz-cmp1': '<div>CMP1</div>',
                'doz-cmp2': '<div>CMP2</div>',
                'doz-cmp3': '<div>CMP3</div>',
                'doz-cmp4': '<div>CMP4</div>',
                'doz-cmp5': '<doz-cmp4></doz-cmp4>'
            };

            document.body.innerHTML = `
                <div id="app">
                    <doz-cmp1>ciao</doz-cmp1>
                    <doz-cmp2>
                        <doz-cmp3></doz-cmp3>
                        <ul>
                            <li>mondo</li>
                        </ul>
                    </doz-cmp2>
                    <doz-cmp5>
                        <doz-cmp5>
                            <doz-cmp4></doz-cmp4>
                        </doz-cmp5>
                    </doz-cmp5>
                    <doz-cmp5></doz-cmp5>
                </div>`;

            const appRoot = document.getElementById('app');

            function getInstances(n) {
                while (n) {
                    const isCmp = collections[n.nodeName.toLowerCase()];
                    if (isCmp) {
                        const newNode = html.create(isCmp);
                        n.insertBefore(newNode, n.firstChild);
                        console.log('mounted', n.nodeName);
                    }
                    if (n.hasChildNodes()) {
                        getInstances(n.firstChild)
                    }
                    n = n.nextSibling;
                }
            }
            console.log(appRoot.innerHTML);
            getInstances(appRoot);
            console.log(appRoot.innerHTML);
        });


    });
});