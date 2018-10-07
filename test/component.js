const {component} = require('../index');
const be = require('bejs');
const collection = require('../src/collection');

describe('component', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create', function () {
        it('should be registered', function () {
            const tag = 'my-component';
            component(tag);
            const result = collection.getComponent(tag);
            console.log(result);
            be.err.not.undefined(result);
        });

        it('wrong tag name', function () {
            const tag = 'mycomponent';
            try {
                component(tag);
            } catch (e) {
                be.err.equal(e.message, 'Tag must contain a dash (-) like my-component');
            }
        });

    });
});