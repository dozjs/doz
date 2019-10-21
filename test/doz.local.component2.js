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

class GridComponent extends Doz.Component {
    constructor(o) {
        super(o);
        this.myFunc = new Date();
        this.props = {
            data: [],
            myFunc: function () {},
            myFunc2: function () {}
        };
    }
    template(h) {
        //console.log(this.props.dateObj.getDate())
        console.log('myFunc', typeof this.props.myFunc, this.props.myFunc)
        //console.log('myFunc2', typeof this.props.myFunc2 )
        //console.log('data', this.props.data)
        return h`
            <div>
                _______________________${typeof this.props.myFunc === 'function' ? this.props.myFunc() : 'NO FUNC'}
                ${this.each(this.props.data, item => h`
                    <${RowComponent} name="${item.name}"/>
                `)}
            </div>
        `
    }
}

class RowComponent extends Doz.Component {
    template(h) {
        return h`
            <div>my name is ${this.props.name}</div>
        `
    }
}

describe('Doz.local.component2', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with local component', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            new Doz({
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
                be.err.true(/Doz component/g.test(html));
                be.err.true(/my button by wrapper component/g.test(html));
                be.err.true(/my button by Doz/g.test(html));
                be.err(done).true(/Luis component/g.test(html));
            }, 100);

        });
    });

    describe('create app with local component inside a loop', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            function aFunction() {
                console.log('aaaaa')
                return 1
            }

            new Doz({
                root: '#app',
                props: {
                    records: [
                        {name: 'Joy'},
                        {name: 'Mike'},
                        {name: 'Paul'},
                        {name: 'Fred'},
                        {name: 'Ted'},
                    ]
                },
                template(h) {
                    let o = h`
                        <${GridComponent} my-func="${aFunction}" name="${'boom'}" data="${this.props.records}" />
                    `;
                    //console.log(JSON.stringify(o, null, 4))
                    return o;
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(require('../src/vdom/map-compiled').data);
                console.log(html);
                be.err.true(/my name is Joy/g.test(html));
                be.err.true(/my name is Mike/g.test(html));
                be.err.true(/my name is Paul/g.test(html));
                be.err.true(/my name is Fred/g.test(html));
                be.err.true(/my name is Ted/g.test(html));
                done();
            }, 100);

        });
        it('should be ok 2', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;
            function aFunction() {
                console.log('bbbbb', 1 > 2);
                return 1
            }
            new Doz({
                root: '#app',
                props: {
                    records: []
                },
                template(h) {
                    let o = h`
                        <${GridComponent} my-func="${aFunction}" name="${'boom'}"  />
                    `;
                    //console.log(require('../src/vdom/map-compiled').data);
                    //console.log(JSON.stringify(o, null, 4))
                    return o;
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(require('../src/vdom/map-compiled').data);
                console.log(html);
                done();
            }, 100);

        });
    });

});