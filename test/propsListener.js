import Doz from "../src/index.js";
import be from "bejs";

describe('propsListener', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.component('salutation-card', {
                propsListener: {
                    myTitle: 'myTitleHandler',
                    name: 'nameHandler'
                },

                nameHandler(value) {
                    //console.log('call nameHandler', value);
                    result.push(value);
                },

                myTitleHandler(value) {
                    //console.log('call myTitleHandler', value);
                    result.push(value);
                },

                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                },
                onMount() {
                    this.props.name = 'a name';
                    this.props.myTitle = 'a title';
                }
            });

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
                        <div>
                            ${this.props.nameA}
                            <salutation-card
                                my-title="MR."
                                name="Doz">
                            </salutation-card>
                        </div>
                    `
                },

                descHandler(value) {
                    be.err.not.undefined(this.props);
                    //console.log('call descHandler', value);
                    result.push(value);
                },

                onMount() {
                    this.props.desc = 'a desc';
                }
            });

            setTimeout(() => {
                be.err(done).equal(result, ['a name', 'a title', 'a desc'])
            }, 100);

        });

        it('should be ok with function', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.component('salutation-card', {
                propsListener: {
                    myTitle: function(value) {
                        //console.log('call myTitleHandler', value);
                        result.push(value);
                    },
                    name: (value) => {
                        //console.log('call nameHandler', value);
                        result.push(value);
                    }
                },

                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                },
                onMount() {
                    this.props.name = 'a name';
                    this.props.myTitle = 'a title';
                }
            });

            new Doz({
                root: '#app',

                propsListener: {
                    desc: function(value){
                        be.err.not.undefined(this.props);
                        //console.log('call descHandler', value);
                        result.push(value);
                    }
                },

                props: {
                    desc: 'hello'
                },

                template(h) {
                    return h`
                        <div>
                            ${this.props.nameA}
                            <salutation-card
                                my-title="MR."
                                name="Doz">
                            </salutation-card>
                        </div>
                    `
                },

                onMount() {
                    this.props.desc = 'a desc';
                }
            });

            setTimeout(() => {
                be.err(done).equal(result, ['a name', 'a title', 'a desc'])
            }, 100);

        });
    });
});