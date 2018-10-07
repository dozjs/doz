const Doz = require('../index');
const be = require('bejs');

describe('Doz.scoped.style', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                style: {
                    h1: {
                        color: 'red',
                        fontWeight: 'bold'
                    },
                    h2: {
                        color: 'yellow'
                    },
                    '.foo, .bar': {
                        display: 'inline'
                    },
                    '@media only screen and (max-width: 600px)': {
                        'h1,h2': {
                            color: 'green'
                        }
                    }
                },
                template() {
                    return `
                        <div>
                            <h1>Hello</h1>
                            <h2>${this.props.myTitle} ${this.props.name}</h2>
                            <div class="foo">foo</div>
                            <div class="bar">bar</div>
                        </div>
                    `
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

            setTimeout(()=>{
                const styleExpect = 'salutation-card h1{color:red;font-weight:bold;} salutation-card h2{color:yellow;} salutation-card .foo,salutation-card  .bar{display:inline;} @media only screen and (max-width: 600px) {salutation-card h1,salutation-card h2{color:green;} }';
                const html = document.head.innerHTML;
                console.log(html);
                be.err(done).equal(styleExpect, document.querySelector('#salutation-card--style').innerHTML);
            },100);
        });

        it('(pattern class) should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.define('salutation-card', class extends Doz.Component {

                constructor(obj) {
                    super(obj);

                    this.config = {
                        style: {
                            h1: {
                                color: 'red',
                                fontWeight: 'bold'
                            },
                            h2: {
                                color: 'yellow'
                            },
                            '.foo, .bar': {
                                display: 'inline'
                            },
                            '@media only screen and (max-width: 600px)': {
                                'h1,h2': {
                                    color: 'green'
                                }
                            }
                        }
                    };
                }

                template() {
                    return `
                        <div>
                            <h1>Hello</h1>
                            <h2>${this.props.myTitle} ${this.props.name}</h2>
                            <div class="foo">foo</div>
                            <div class="bar">bar</div>
                        </div>
                    `
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

            setTimeout(()=>{
                const styleExpect = 'salutation-card h1{color:red;font-weight:bold;} salutation-card h2{color:yellow;} salutation-card .foo,salutation-card  .bar{display:inline;} @media only screen and (max-width: 600px) {salutation-card h1,salutation-card h2{color:green;} }';
                const html = document.head.innerHTML;
                console.log(html);
                be.err(done).equal(styleExpect, document.querySelector('#salutation-card--style').innerHTML);
            },100);
        });
    });
});