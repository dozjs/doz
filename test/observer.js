const be = require('bejs');
const observer = require('../src/observer');

describe('Observer', function () {

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

    describe('create basic', function () {
        it('should changed', function (done) {
            const t = {
                template: '<div>hello</div>',
                context: {
                    a: 'ciao',
                    b: function () {
                        this.a = 'lo cambio da qui';
                    },
                    c: {
                        d: 'sotto',
                        e: {
                            f: 'deep',
                            d: 'dddd'
                        }
                    }
                }
            };

            const context = observer(t.context, (value, old) => {
                console.log('Object changed:', value, 'before:', old);
                if (value === 'sopra' && old === 'sotto')
                    done();
            });
            //console.log(context);
            context.c.d = 'sopra';

        });

        it('should changed, new property', function (done) {
            const t = {
                template: '<div>hello</div>',
                context: {
                    a: 'ciao',
                    b: function () {
                        this.a = 'lo cambio da qui';
                    },
                    c: {
                        d: 'sotto',
                        e: {
                            f: 'deep',
                            d: 'dddd'
                        }
                    }
                }
            };

            const context = observer(t.context, (value, old, isNew) => {
                console.log('Object new property:', value, 'before:', old, 'isNew:', isNew);
                be.err.equal(value, 'sopra');
                be.err.undefined(old);
                be.err.true(isNew);
                done();
            });
            //console.log(context);
            context.y = 'sopra';
            console.log(context.y);

        });
        it('should changed, new property nested', function (done) {
            const t = {
                template: '<div>hello</div>',
                context: {
                    a: 'ciao',
                    b: function () {
                        this.a = 'lo cambio da qui';
                    },
                    c: {
                        d: 'sotto',
                        e: {
                            f: 'deep',
                            d: 'dddd'
                        }
                    }
                }
            };

            const context = observer(t.context, (value, old, isNew, path) => {
                console.log('Object new property:', value, 'before:', old, 'isNew:', isNew, 'path:', path);
                be.err.equal(value, 'sopra');
                be.err.undefined(old);
                be.err.true(isNew);
                be.err.equal(path, ['c', 'e', 'x']);
                done();
            });

            context.c.e.x = 'sopra';
            console.log(context.c.e.x);

        });
        it('should changed, deep array', function (done) {
            const t = {
                template: '<div>hello</div>',
                context: {
                    a: 'ciao',
                    b: function () {
                        this.a = 'lo cambio da qui';
                    },
                    c: {
                        d: [
                            'sono array'
                        ],
                        e: {
                            f: 'deep',
                            d: 'dddd'
                        }
                    }
                }
            };

            const context = observer(t.context, (value, old, isNew, path) => {
                console.log('Object changed:', value, 'before:', old, path);
                be.err.equal(value, 'sopra');
                be.err.equal(old, 'sono array');
                be.err.false(isNew);
                be.err.equal(path, ['c', 'd', '0']);
                done();
            });
            //console.log(context);
            context.c.d[0] = 'sopra';
            context.c.d[1] = 'sopra1';

        });

    });
});