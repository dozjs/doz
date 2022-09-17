import Doz from "../src/index.js";
import be from "bejs";

describe('propsConvert', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok with object definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.component('salutation-card', {
                propsListener: {
                    myTitle: function(value) {
                        result.push(value);
                    },
                    name: (value) => {
                        result.push(value);
                    }
                },
                propsConvert: {
                    myTitle: function(value) {
                        return value + ' suffix1';
                    },
                    name: (value) => {
                        return value + ' suffix2';
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
                        result.push(value);
                    }
                },

                propsConvert: {
                    desc: function(value){
                        return value + ' suffix3';
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
                be.err(done).equal(result, ['a desc suffix3', 'a name suffix2', 'a title suffix1'])
            }, 100);

        });

        it('should be ok with class definition', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.define('salutation-card', class extends Doz.Component{

                constructor(o) {
                    super(o);

                    this.propsListener = {
                        myTitle: function(value) {
                            result.push(value);
                        },
                        name: (value) => {
                            result.push(value);
                        }
                    };

                    this.propsConvert = {
                        myTitle: function(value) {
                            return value + ' suffix1';
                        },
                        name: (value) => {
                            return value + ' suffix2';
                        }
                    };
                }

                template() {
                    return `
                        <div>Hello ${this.props.myTitle} ${this.props.name}</div>
                    `
                }

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
                        result.push(value);
                    }
                },

                propsConvert: {
                    desc: function(value){
                        return value + ' suffix3';
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
                be.err(done).equal(result, ['a desc suffix3', 'a name suffix2', 'a title suffix1'])
            }, 100);

        });

        it('should be ok with props number', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const result = [];

            Doz.define('sum-card', class extends Doz.Component{

                constructor(o) {
                    super(o);

                    this.propsConvert = {
                        myNumber: function(value) {
                            let res = value * 2;
                            result.push(res);
                            return res;
                        }
                    };
                }

                template() {
                    return `
                        <div>The sum is ${this.props.myNumber}</div>
                    `
                }
            });

            new Doz({
                root: '#app',

                template(h) {
                    return h`
                        <div>
                            <sum-card
                                my-number="${5}">
                            </sum-card>
                        </div>
                    `
                }
            });

            setTimeout(() => {
                //console.log(document.body.innerHTML);
                be.err(done).equal(result, [10])
            }, 100);

        });
    });
});