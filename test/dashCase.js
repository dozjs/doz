import Doz from "../src/index.js";
import be from "bejs";

describe('dashCase', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                },
                onCreate() {
                    //console.log(this.props)
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        my-title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            //setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err(done).true(/MR\. Doz/g.test(html));
            //},100);
        });

        it('should be ok with directive d-is', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                },
                onCreate() {
                    //console.log(this.props)
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <div d-is="salutation-card"
                        my-title="MR."
                        name="Doz">
                    </div>
                `
            });

            //setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err(done).true(/MR\. Doz/g.test(html));
            //},100);
        });
    });
});