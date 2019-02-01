const {compile} = require('../src/vdom/parser');
const assert = require('assert');

function printObj(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

describe('parser2', function () {
    it('should ok', function () {

        const root = compile(`
            <main id="hola" d:store="mystore">
                <ul id="list" data-any="2">
                    <li onclick="console.log('hello')" data-o="cia">Hello World</li>
                </ul>
            </main>
        `);

        //printObj(root);
        assert.strictEqual(root.type, 'main');
        assert.strictEqual(root.props['d:store'], 'mystore');
        assert.strictEqual(root.children[1].props['data-any'], 2);

    });

    it('should be SVG', function () {
        const root = compile(`
            <div>
                <svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
                    preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="background: none;">
                    <circle cx="50" cy="50" fill="none"
                    stroke-linecap="round" r="40" stroke-width="4" stroke="#b8b8b8"
                    stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(180 50 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50"
                            keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                    </circle>
                </svg>
                <p>hello world</p>
            </div>
        `);

        //printObj(root);
        assert.strictEqual(root.isSVG, false);
        assert.strictEqual(root.children[1].isSVG, true);
        assert.strictEqual(root.children[1].children[1].isSVG, true);
        assert.strictEqual(root.children[3].isSVG, false);

    });

    it('should convert dz-text-node', function () {
        const root = compile(`
            <div>
                <dz-text-node>Hello text</dz-text-node>
                <p>Ciao Mondo</p>
            </div>
        `);

        //printObj(root);
        assert.strictEqual(root.children[1], 'Hello text');
    });

    it('should get attribute without value', function () {
        const root = compile(`
            <button class="myColor" disabled id="test">
                click me!
            </button>
        `);

        //printObj(root);
        assert.strictEqual(root.props.disabled, '');
    });

    it('should remove double spaces', function () {
        const root = compile(`
            <button class="myColor" disabled id="test" 
            style="
            min-width: 100px;
            height: 20px;
            ">
                          click me!
            </button>
        `);

        //printObj(root);
        assert.strictEqual(root.props.style, ' min-width: 100px; height: 20px; ');
    });

});