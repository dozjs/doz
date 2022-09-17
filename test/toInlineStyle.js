import toInlineStyle from "../src/utils/toInlineStyle.js";
import be from "bejs";

describe('toInlineStyle', function () {

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