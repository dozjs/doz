const Doz = require('../index');
const be = require('bejs');

describe('removeSpecialsAttributes', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('caller-o', {
                template(h) {
                    return h`<div id="d:on">Callback</div>`
                },
                onCreate() {
                    //console.log('created');
                    setTimeout(() => {
                        this.emit('mycallback', 'hello');
                    }, 1000);
                    //console.log(this.parent.tag)
                }
            });

            Doz.component('a-component', {
                template() {
                    return `<div id="d-is">hello</div>`
                }
            });

            Doz.component('salutation-card', {
                props: {
                    aValue: ''
                },
                template(h) {
                    return h`
                        <div id="d-ref" d-ref="myDiv">Hello</div>
                        <input id="d-bind" type="text" d-bind="aValue">
                        <span id="d-is" d-is="a-component"></span>
                        <caller-o d:on-mycallback="aCallback"/>
                    `
                },
                aCallback(arg) {
                    //console.log('callback is called', arg);
                    be.err.equal(arg, 'hello');
                },
                onMount() {
                    this.props.aValue = 'ciao';
                },
                onMountAsync() {
                    //console.log(document.body.innerHTML);

                    // d-ref
                    be.err.false(document.getElementById('d-ref').hasAttribute('d-ref'));
                    be.err.false(document.getElementById('d-ref').hasAttribute('dref'));

                    // d-bind
                    be.err.false(document.getElementById('d-bind').hasAttribute('d-bind'));
                    be.err.false(document.getElementById('d-bind').hasAttribute('dbind'));

                    // d-is
                    be.err.false(document.getElementById('d-is').parentNode.hasAttribute('d-is'));
                    be.err.false(document.getElementById('d-is').parentNode.hasAttribute('dis'));

                    // d:on
                    //be.err.false(document.getElementById('d:on').parentNode.hasAttribute('d:on'));

                    done();
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card />
                `
            });
        });
    });
});