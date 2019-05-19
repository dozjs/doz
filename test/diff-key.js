const diffKey = require('../src/vdom/diff-key');
const be = require('bejs');

describe('diff-key', function () {

    it('#1 should return [2]', function () {

        let oldChildren = [
            {},
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 200
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let newChildren = [
            {},
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let diff = diffKey(newChildren, oldChildren);

        be.err.equal(diff, [2]);
    });

    it('#2 should return [2]', function () {

        let oldChildren = [
            {
                props: {
                    title: 'hello'
                }
            },
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 200
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let newChildren = [
            {
                props: {
                    title: 'hello'
                }
            },
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let diff = diffKey(newChildren, oldChildren);

        console.log(diff);

        be.err.equal(diff, [2]);
    });

    it('#3 should return [0, 1]', function () {

        let oldChildren = [
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let newChildren = [
        ];

        let diff = diffKey(newChildren, oldChildren);

        console.log(diff);

        be.err.equal(diff, [0, 1]);
    });

    it('#4 should return []', function () {

        let oldChildren = [];

        let newChildren = [];

        let diff = diffKey(newChildren, oldChildren);

        console.log(diff);

        be.err.equal(diff, []);
    });

    it('#5 should return [2]', function () {

        let oldChildren = [
            {
                props: {
                    title: 'hello'
                }
            },
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 200
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let newChildren = [
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let diff = diffKey(newChildren, oldChildren);

        console.log(diff);

        be.err.equal(diff, [2]);
    });

    it('#6 should return [2]', function () {

        let oldChildren = [
            {
                props: {
                    title: 'hello'
                }
            },
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 200
                }
            },
            {
                props: {
                    'data-key': 200
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let newChildren = [
            {
                props: {
                    'data-key': 100
                }
            },
            {
                props: {
                    'data-key': 300
                }
            }
        ];

        let diff = diffKey(newChildren, oldChildren);

        console.log(diff);

        be.err.equal(diff, [2, 3]);
    });
});