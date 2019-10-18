const Doz = require('../index');
const be = require('bejs');

class buttonComponent extends Doz.Component {
    template(h) {
        return h`
            <button>my button ${this.props.name}</button>
        `
    }
}

class WrapperComponent extends Doz.Component {
    template(h) {
        return h`
            <div>
                <span>hello I'm ${this.props.name} component </span> <${buttonComponent} name="by wrapper component"/>
            </div>
        `
    }
}

describe('Doz.local.component2', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with local component', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <${WrapperComponent}
                            d-alias="first-component"
                            id="12"
                            title="MR."
                            name="Doz"/>
                        <${WrapperComponent}
                            d-alias="second-component"
                            id="34"
                            title="MRS."
                            name="Luis"/>
                        <${buttonComponent} name="by Doz"/>    
                    `
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                console.log(html);
                //console.log(view);
                be.err.true(/Doz component/g.test(html));
                be.err.true(/my button by wrapper component/g.test(html));
                be.err.true(/my button by Doz/g.test(html));
                be.err(done).true(/Luis component/g.test(html));
            }, 100);

        });

    });

});