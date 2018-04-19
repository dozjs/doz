const helper = require('../../src/utils/helper');
const be = require('bejs');

describe('component.helper', function () {

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

    describe('objectToPath', function () {
        it('should be a path', function () {
            const result = helper.objectToPath({ p: { counter: 0, other: 4 , hr: 20, low: [97] } });
            console.log(result);
        });
        it('should be a path with array', function () {
            const result = helper.objectToPath([3,5,7]);
            console.log(result);
        });
        it('should be a path with string', function () {
            const result = helper.objectToPath('hhhhh');
            console.log(result);
        });
        it('should be a path with number', function () {
            const result = helper.objectToPath(2);
            console.log(result);
        });
        it('should be a path with boolean', function () {
            const result = helper.objectToPath(true);
            console.log(result);
        });
        it('should be a path with function', function () {
            const result = helper.objectToPath(function () {
                
            });
            console.log(result);
        });

    });
});