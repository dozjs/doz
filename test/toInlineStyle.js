const toInlineStyle = require('../src/utils/toInlineStyle');
const be = require('bejs');

describe('Utils.to-inline-style', function () {

    it('should be ok', function () {

        const css = {
            background: '#000',
            color: '#fff',
            userSelect: 'none'
        };

        const style = toInlineStyle(css);

        be.err.equal('style="background:#000;color:#fff;user-select:none;"', style);

    });

});