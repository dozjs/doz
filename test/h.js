const {compile} = require('../src/vdom/parser');
const h = require('../src/vdom/h');
const {updateElement} = require('../src/vdom/index');
const html = require('../src/utils/html');
const be = require('bejs');
const DOM = require('../src/component/DOMManipulation');
const mapCompiled = require('../src/vdom/mapper');

describe('h', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create', function () {
        it('should be ok', function () {
            document.body.innerHTML = `<div id="app"></div>`;
            let arr = [0,1,2,3,4,5];
            const res = h`
                <div>hello ${'ciao'}
                    <button disabled>testo</button>
                    ${h`
                        <div>bau</div>
                        <ul>${arr.map(i => h`<li>${i} ciao ${h`<span>foobar ${Date.now()}</span>`}</li>`)}</ul>
                    `}
                </div>
                `;

            console.log(mapCompiled.data);
            console.log(JSON.stringify(res, null, 4));
        });
    });
});