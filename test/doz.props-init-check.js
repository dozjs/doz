const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-convert-init', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

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
                console.log(document.body.innerHTML);
                done();
                //be.err(done).equal(result, ['a desc suffix3', 'a name suffix2', 'a title suffix1'])
            }, 500);

        });

    });
});