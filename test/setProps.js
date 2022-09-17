import Doz from "../src/index.js";
import be from "bejs";

describe('setProps', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok #1', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} - ${this.props.subtitle}</div>
                    `
                },
                onMount() {
                    this.setProps({
                        title: 'FOO',
                        subtitle: 'BAR'
                    });

                    setTimeout(() => {
                        be.err.equal(this.props.title, 'FOO');
                        be.err.equal(this.props.subtitle, 'BAR');
                        done();
                    }, 200);

                    //be.err(done).domElement(this.ref.myDiv);
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });

        it('should be ok #2', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.props.title} - ${this.props.subtitle}</div>
                    `
                },
                onMount() {
                    this.setPropsAsync({
                        title: 'FOO',
                        subtitle: 'BAR'
                    });

                    setTimeout(() => {
                        be.err.equal(this.props.title, 'FOO');
                        be.err.equal(this.props.subtitle, 'BAR');
                        done();
                    }, 200);

                    //be.err(done).domElement(this.ref.myDiv);
                }
            });
            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });
    });
});