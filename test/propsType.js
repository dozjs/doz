const Doz = require('../index');
const be = require('bejs');

describe('propsType', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with auto-cast', function (done) {
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
                template(h) {
                    return h`
                        <my-cmp
                            mnumber="${5}"
                            mfloat="${5.3}"
                            mzero="${0}"
                            mzeromore="00"
                            mstring="Doz"
                            marray="${[1, 2, 3]}"
                            mobject='${{"a": 1, "b": 2, "c": 3, "d": [9,10]}}'
                            mbooleantrue="${true}"
                            mbooleanfalse="${false}"
                        />
                    `
                }
            });
        });

        it('should be ok with type defined as string', function (done) {
            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('my-cmp', {

                propsType: {
                    mnumber: 'string',
                    mfloat: 'string',
                    mzero: 'string',
                    mzeromore: 'string',
                    mstring: 'string',
                    marray: 'string',
                    mobject: 'string',
                    mbooleantrue: 'string',
                    mbooleanfalse: 'string',
                    mdate: 'date'
                },

                template() {
                    return `
                        <div>Hello ${this.props.mnumber} ${this.props.mstring}</div>
                    `
                },
                onMount() {
                    be.err.string(this.props.mnumber);
                    be.err.string(this.props.mfloat);
                    be.err.string(this.props.mzero);
                    be.err.string(this.props.mzeromore);
                    be.err.string(this.props.mstring);
                    be.err.string(this.props.marray);
                    be.err.string(this.props.mobject);
                    be.err.string(this.props.mbooleantrue);
                    be.err.string(this.props.mbooleanfalse);
                    be.err.true(this.props.mdate instanceof Date);
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
                        marray="[1, 2, 3]"
                        mobject='{"a": 1, "b": 2, "c": 3, "d": [9,10]}'
                        mbooleantrue="true"
                        mbooleanfalse="false"
                        mdate="2019-06-08"
                    />
                `
            });
        });
    });
});