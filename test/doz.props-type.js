const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-type', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with autocast', function (done) {
            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('my-cmp', {
                template() {
                    return `
                        <div>Hello ${this.props.mnumber} ${this.props.mstring}</div>
                    `
                },
                onMount() {
                    be.err.number(this.props.mnumber);
                    be.err.float(this.props.mfloat);
                    be.err.number(this.props.mzero);
                    be.err.string(this.props.mzeromore);
                    be.err.string(this.props.mstring);
                    be.err.array(this.props.marray);
                    be.err.object(this.props.mobject);
                    be.err.true(this.props.mbooleantrue);
                    be.err.false(this.props.mbooleanfalse);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <my-cmp
                        mnumber="5"
                        mfloat="5.3"
                        mzero="0"
                        mzeromore="00"
                        mstring="Doz"
                        marray="[1, 2,3]"
                        mobject="{a: 1, b: '2', c:3}"
                        mbooleantrue="true"
                        mbooleanfalse="false"
                    />
                `
            });
        });
    });
});