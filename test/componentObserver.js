import {expect} from "chai";
import ObservableSlim from "../src/proxy.js";

describe('observable-slim.js', _ => {

    let test, p;

    beforeEach(() => {
        test = {};
        p = ObservableSlim.create(test, false, function(changes) { return null; });
    });

    it('Add a new string property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.equal("world");
        });
        p.hello = "world";
        expect(p.hello).to.equal("world");
        expect(test.hello).to.equal("world");
    });

    it('Modify string property value.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.equal("WORLD");
        });

        test.hello = "world";
        p.hello = "WORLD";
        expect(p.hello).to.equal("WORLD");
        expect(test.hello).to.equal("WORLD");
    });

    it('Add a new object property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.be.an.instanceof(Object);
        });
        p.testing = {};
        expect(p.testing).to.be.an.instanceof(Object);
        expect(test.testing).to.be.an.instanceof(Object);
    });

    it('Add a new nested number property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.equal(42);
            expect(changes[0].currentPath).to.equal("testing.blah");
        });
        test.testing = {};
        p.testing.blah = 42;
        expect(p.testing.blah).to.be.equal(42);
        expect(test.testing.blah).to.be.equal(42);
    });

    it('Add a new array property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.be.an.instanceof(Array);
        });
        p.arr = [];
        expect(p.arr).to.be.an.instanceof(Array);
        expect(test.arr).to.be.an.instanceof(Array);
    });

    it('Add item to array.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.equal("hello world");
            expect(changes[0].currentPath).to.equal("arr");
            expect(changes[0].property).to.equal("0");
        });
        test.arr = [];
        p.arr.push("hello world");
        expect(p.arr[0]).to.equal("hello world");
        expect(test.arr[0]).to.equal("hello world");
    });

    it('Delete a property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("delete");
            expect(changes[0].property).to.equal("hello");
        });

        test.hello = "hello";
        delete p.hello;

        expect(test.hello).to.be.an('undefined');
        expect(p.hello).to.be.an('undefined');
    });

    it('Splice first item from an array.', () => {
        var firstChange = true;
        ObservableSlim.observe(p, function(changes) {
            if (firstChange === true) {
                firstChange = false;
                expect(changes[0].type).to.equal("delete");
                expect(changes[0].previousValue).to.equal("hello world");
            } else {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("length");
            }
        });

        test.arr = [];
        test.arr.push("hello world");
        p.arr.splice(0,1);

        expect(test.arr.length).to.equal(0);
        expect(p.arr.length).to.equal(0);
    });

    it('__isProxy check', () => {
        expect(p.__isProxy).to.be.equal(true);
    });

    it('__getParent on nested object.', () => {
        p.hello = {};
        p.hello.blah = {"found":"me"};
        test.hello.blah.foo = {};
        var target = p.hello.blah.foo;
        expect(target.__getParent().found).to.equal("me");
    });

    it('Multiple observables on same object.', () => {
        var firstProxy = false;
        var secondProxy = false;
        var pp = ObservableSlim.create(test, false, function(changes) {
            if (changes[0].currentPath === "dummy" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        var ppp = ObservableSlim.create(pp, false, function(changes) {
            if (changes[0].currentPath === "dummy" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.dummy = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('Multiple observables on same object with nested objects.', () => {
        var firstProxy = false;
        var secondProxy = false;
        var testing = {"foo":{"bar":"bar"}};
        var pp = ObservableSlim.create(testing, false, function(changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        var ppp = ObservableSlim.create(testing, false, function(changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.foo.bar = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('Multiple observables on same object with nested objects by passing in a Proxy to `create`.', () => {
        var firstProxy = false;
        var secondProxy = false;
        var testing = {"foo":{"bar":"bar"}};
        var pp = ObservableSlim.create(testing, false, function(changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        var ppp = ObservableSlim.create(pp, false, function(changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.foo.bar = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('Before change, add a new string property.', () => {
        ObservableSlim.observe(p, function(changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.equal("world");
        });

        p.hello = "world";
        expect(p.hello).to.equal("world");
        expect(test.hello).to.equal("world");
    });

    it('Before change, try to add a new string property, but returning false.', () => {
        let callbackTriggered = false;
        ObservableSlim.observe(p, function (changes) {
            callbackTriggered = true;
        });

        ObservableSlim.beforeChange(p, function (changes) {
            return false;
        });

        p.hello = "world";
        expect(p.hello).to.be.an('undefined');
        expect(test.hello).to.be.an('undefined');
        expect(callbackTriggered).to.equal(false);
    });

    it('Before change, try to modify string property value, but returning false.', () => {
        let callbackTriggered = false;
        ObservableSlim.observe(p, function (changes) {
            callbackTriggered = true;
        });

        ObservableSlim.beforeChange(p, function (changes) {
            return false;
        });

        test.hello = "world";
        p.hello = "WORLD";
        expect(p.hello).to.equal("world");
        expect(test.hello).to.equal("world");
        expect(callbackTriggered).to.equal(false);
    });

    it('Before change, try to delete a property, but returning false.', () => {
        let callbackTriggered = false;
        ObservableSlim.observe(p, function (changes) {
            callbackTriggered = true;
        });

        ObservableSlim.beforeChange(p, function (changes) {
            return false;
        });

        test.hello = "hello";
        delete p.hello;

        expect(p.hello).to.equal("hello");
        expect(test.hello).to.equal("hello");
        expect(callbackTriggered).to.equal(false);
    });

    it('35. JSON.stringify does not fail on proxied date.', () => {
        var test = {d: new Date()};
        var p = ObservableSlim.create(test, false, function () {});

        JSON.stringify(p);
    });

    it('36. valueOf does not fail on proxied date.', () => {
        var test = {d: new Date()};
        var p = ObservableSlim.create(test, false, function () {});

        p.d.valueOf();
    });

    it('37. Delete property after calling ObservableSlim.remove does not fail.', () => {
        var test = {foo: 'foo'};
        var p = ObservableSlim.create(test, false, function () {});

        ObservableSlim.remove(p);
        delete p.foo;
    });

    it('38. Proxied Date.toString outputs the pristine Date.toString.', () => {
        var test = {d: new Date()};
        var p = ObservableSlim.create(test, false, function () {});

        expect(p.d.toString()).to.equal(test.d.toString());
    });

    it('39. Proxied Date.getTime outputs the pristine Date.getTime.', () => {
        var test = {d: new Date()};
        var p = ObservableSlim.create(test, false, function () {});
        p.d = new Date();

        expect(p.d.getTime()).to.equal(test.d.getTime());
    });

    it('40. __targetPosition helper is non-enumerable.', () => {

        var found = false;

        var test = {d: new Date()};
        var p = ObservableSlim.create(test, false, function () {});

        for (var prop in test) {
            if (prop === "__targetPosition") found = true;
        }

        var keys = Object.keys(test);
        var i = keys.length;
        while (i--) {
            if (keys[i] === "__targetPosition") found = true;
        }

        expect(found).to.equal(false);

    });

    it('41. Proxied function', () => {
        var test = {d: function () {
                return 1
            }};
        var p = ObservableSlim.create(test, false, function () {});

        expect(p.d()).to.equal(test.d());
    });
});