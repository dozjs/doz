const {parser} = require('../src/parser');
const be = require('bejs');
const collection = require('../src/collection');

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
            document.body.innerHTML = `<div id="app">hello<button disabled>testo</button></div>`;
            const appElement = document.getElementById('app');
            parser(appElement);
        });


    });
});