const {scopedInner} = require('../src/component/style');
const be = require('bejs');

describe('Component.scoped-inner', function () {

    it('should be ok', function () {

        const style = `
            button, img{
                color: red;
                background-color: yellow;
                font-size: 20px;
                padding: 20px;
            }
            @media only screen and (max-width: 600px) {
                button {
                    color: white;
                    background-color: green;
                }
            }
        `;

        const result = scopedInner(style, 'x-any');

        be.err.true(/x-any button,x-any img{/g.test(result));
        be.err.true(/x-any button {/g.test(result));

    });

});