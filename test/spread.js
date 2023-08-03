import Doz from "../src/index.js";
//import be from "bejs";

describe('spread', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                props: {
                    show: false
                },
                template(h) {
                    return h`
                        <div title="hello">Hello</div>
                    `
                },
                onMount() {
                    if (this.props.a && this.props.b) {
                        done()
                    } else {
                        throw new Error('props not found')
                    }
                }
            });
            new Doz({
                root: '#app',
                template(h){
                    let someProps = {a: 1, b: 2};
                    return h`
                    <salutation-card ...${someProps}/>
                `}
            });
        });
    });
});