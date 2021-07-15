const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-context', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            class SalutationCard extends Doz.Component{

                constructor(o) {
                    super(o);
                    this.propsContext = true;
                }

                template(h) {
                    return h`
                        <${SalutationCardInner}/>
                    `
                }

                onMount() {
                    setTimeout(() => {
                        this.props.myTitle = 'Lorem';
                        this.props.name = 'Ipsum';
                    }, 60)
                }
            }

            class SalutationCardInner extends Doz.Component{

                constructor(o) {
                    super(o);
                }

                template(h) {
                    return h`
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                }

            }

            new Doz({
                root: '#app',

                propsListener: {
                    desc: 'descHandler'
                },

                props: {
                    desc: 'hello'
                },

                template(h) {
                    return h`
                        <${SalutationCard}
                            my-title="MR."
                            name="Doz">
                        </>
                    `
                },

                listeners: {
                    componentCreate(component) {
                        if (component.parent && component.parent.propsContext) {
                            component.propsContext = component.parent.propsContext;
                            Object.keys(component.parent.props).forEach(propParent => {
                                component.props[propParent] = component.parent.props[propParent];
                            })
                        }
                    },

                    componentUpdate(component, changes) {
                        if (component.propsContext) {
                            //console.log('a', component.tag, changes)
                            Object.keys(component.children).forEach(child => {
                                Object.keys(component.props).forEach(propParent => {
                                    component.children[child].props[propParent] = component.props[propParent];
                                })
                            })
                        }
                    }
                }
            });

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);
                //done()
                //be.err(done).equal(result, ['a desc', 'a name', 'a title'])
            }, 50);

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);
                done()
                //be.err(done).equal(result, ['a desc', 'a name', 'a title'])
            }, 100);

        });
    });
});