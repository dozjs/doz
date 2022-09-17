import Doz from '../src/index.js'
import be from "bejs"

describe('booleanAttributes', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok #1', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="true" d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #2', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #3', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="true" d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #4', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="false" d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #5', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="${false}" d-ref="email">
                    `
                },
                onMount() {
                    be.err.false(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #6', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="${true}" d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #7', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="${0}" d-ref="email">
                    `
                },
                onMount() {
                    be.err.false(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });

        it('should be ok #8', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('boolean-input', {
                template(h) {
                    return h`
                        <input name="email" disabled="${1}" d-ref="email">
                    `
                },
                onMount() {
                    be.err.true(this.ref.email.disabled);
                    done();
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <boolean-input />
                `
            });
        });
    });
});