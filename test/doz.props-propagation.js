const Doz = require('../index');
const be = require('bejs');

describe('Doz.props-context', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        //Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok #1', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component{

                constructor(o) {
                    super(o);
                    this.propsPropagation = true;
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
                }
            });

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);

                if(!/Hello MR\. Doz/.test(result))
                    throw new Error('Fail props-context #1')
            }, 50);

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);

                if(!/Hello Lorem Ipsum/.test(result))
                    throw new Error('Fail props-context #2')

                done()

            }, 100);

        });
        it('should be ok #2', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            class SalutationCard extends Doz.Component{

                constructor(o) {
                    super(o);
                    this.propsPropagation = [
                        'name'
                    ];
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
                }
            });

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);

                if(!/Hello undefined Doz/.test(result))
                    throw new Error('Fail props-context #1')
            }, 50);

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);

                if(!/Hello undefined Ipsum/.test(result))
                    throw new Error('Fail props-context #2')

                done()

            }, 100);

        });
    });
});