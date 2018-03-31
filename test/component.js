const {Component} = require('../');
const be = require('bejs');
const collection = require('../src/collection');

describe('component', function () {

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
        it('should be registered', function () {
            const tag = 'my-component';
            Component(tag);
            const result = collection.get(tag);
            console.log(result);
            be.err.not.undefined(result);
        });
    });
});