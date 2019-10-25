const Doz = require('../index');
const be = require('bejs');

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

            const globalObj = function myFunc() {return 'hello doz'};

            const GridComponent = class extends Doz.Component {
                constructor(o) {
                    super(o);
                    this.props = {
                        data: []
                    };
                }
                template(h) {
                    let res = h`
                        <div>
                            ${this.each(this.props.data, item => h`
                                <${RowComponent} name="${item.name}" theobj="${globalObj}"/>
                            `)}
                        </div>
                    `;
                    //console.log(JSON.stringify(res, null, 4))
                    //console.log(res.children[0].props.theobj === globalObj)
                    return res;
                }
            };

            const RowComponent = class extends Doz.Component {
                template(h) {
                    //console.log('SAME OBJECT?', this.props.theobj.constructor === globalObj.constructor);
                    if (this.props.theobj.constructor !== globalObj.constructor)
                        throw new Error('theobj doesn\'t match with globalObj');
                    return h`
                        <div>my name is ${this.props.name}</div>
                    `
                }
            };

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
                    return h`
                        <${GridComponent} name="${'boom'}" data="${this.props.records}" />
                    `;
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

            const GridComponent = class extends Doz.Component {
                template(h) {
                    //console.log('ééééééé', this.props)
                    return h`
                        <div>
                        ${this.props.myFunc()}
                        </div>
                    `
                }
            };

            function aFunction() {
                return 1
            }

            new Doz({
                root: '#app',
                props: {
                    records: []
                },
                template(h) {
                    return  h`
                        <${GridComponent} my-func="${aFunction}" name="${'boom'}"  />
                    `;
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                console.log(require('../src/vdom/map-compiled').data);
                console.log(html);
                done();
            }, 100);

        });

        it('should be ok 3', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const GridComponent = class extends Doz.Component {
                template(h) {
                    return h`
                        <div>
                            ${this.props.myFunc.getTime()}
                        </div>
                    `
                }
            };

            new Doz({
                root: '#app',
                props: {
                    records: []
                },
                template(h) {
                    return  h`
                        <${GridComponent} my-func="${new Date()}" name="${'boom'}"/>
                    `;
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML;
                //console.log(require('../src/vdom/map-compiled').data);
                console.log(html);
                done();
            }, 100);

        });

        it('should be ok 4', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;
            const GridComponent = class extends Doz.Component {
                template(h) {
                    return h`
                        <div>
                            ${this.props.name.a[1]}
                        </div>
                    `
                }
            };

            new Doz({
                root: '#app',
                props: {
                    records: []
                },
                template(h) {
                    return  h`
                        <${GridComponent} name="${{a:['boom','foo']}}"  />
                    `;
                }
            });

            setTimeout(() => {
                const html = document.body.innerHTML.trim();
                //console.log(require('../src/vdom/map-compiled').data);
                console.log(html);
                be.err.equal(html, '<div id="app"><dz-app><grid-component0><div>foo</div></grid-component0></dz-app></div>');
                done();
            }, 100);

        });
    });

});