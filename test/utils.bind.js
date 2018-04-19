const bind = require('../src/utils/bind');
const be = require('bejs');

describe('Utils.bind', function () {

    it('should be ok', function (done) {

        let context = {
            t(name) {
                return name.toLowerCase();
            }
        };

        let doBind = {
            m() {
                return this.t('HELLO');
            },
            g: {
                h() {
                    return this.t('WORLD');
                }
            }
        };

        let binded = bind(doBind, context);

        be.err.equal('hello', binded.m());
        be.err.equal('world', binded.g.h());

        try {
            doBind.m();
            done('error')
        } catch (e) {
            done();
        }
    });

});