const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-init-check', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            new Doz({
                root: '#app',

                propsInitCheck: {
                    desc: function(value){
                        return value + ' suffix3';
                    }
                },

                props: {
                    desc: 'hello'
                },

                template(h) {
                    return h`
                        <div>
                            ${this.props.desc}
                        </div>
                    `
                }
            });

            setTimeout(() => {
                be.err(done).equal(document.body.innerHTML, '<div id="app"><dz-app><div> hello suffix3 </div></dz-app></div>')
            }, 500);

        });

    });
});