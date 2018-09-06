const mixin = require('../src/utils/mixin');
const be = require('bejs');

describe('Utils.mixin', function () {

    it('should be ok', function () {

        const objA = {
            method1(){
                return this.constructor.myStatic()
            }
        };

        const objB = {
            method2(){
                return this.constructor
            },

            method3(){
                return true;
            }
        };

        class Main {

            constructor() {
                this.result = false;
            }

            method3() {
                return this.result;
            }

            static myStatic() {
                return true;
            }

        }

        mixin(Main.prototype, [objA, objB]);

        const main = new Main();
        be.err.true(main.method1());
        be.err.false(main.method3());
        be.err.true(Main.myStatic());
    });

});