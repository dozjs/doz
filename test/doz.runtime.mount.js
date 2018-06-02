const Doz = require('../index');
const be = require('bejs');


describe('Doz.runtime.mount', function () {

    this.timeout(4000);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('mount after', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            Doz.component('fist-component', {
                template() {
                    return `<div>hello world</div>`;
                },
                drawOther() {
                    if (this.other) return;

                    this.other = this.mount(`
                        <div>
                            <second-component></second-component>
                            <thirty-component></thirty-component>
                        </div>
                    `);

                    console.log('component mounted');
                    done();
                    this.other.onDestroy = function () {
                        console.log('component destroyed');
                    };
                },
                removeOther() {
                    if (this.other) {
                        this.other.destroy();
                        this.other = null;
                    }
                },
                onCreate() {
                    setTimeout(()=>{
                        this.drawOther();
                        console.log('AFTER', document.body.innerHTML);
                    },1000);
                }
            });

            Doz.component('second-component', {
                props: {
                    state: false
                },
                template() {
                    return `<button onclick="this.toggle()"><i class="fa fa-volume-${this.props.state ? 'off' : 'up'}"></i></button>`;
                },
                toggle() {
                    this.props.state = !this.props.state;
                }
            });

            Doz.component('thirty-component', {
                props: {
                    state: false
                },
                template() {
                    return `<button style="color: red" onclick="this.toggle()"><i class="fa fa-volume-${this.props.state ? 'off' : 'up'}"></i></button>`;
                },
                toggle() {
                    this.props.state = !this.props.state;
                }
            });

            new Doz({
                root: '#app',
                template: `<fist-component></fist-component>`
            });
        });
    });

    describe('unmount after', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            Doz.component('fist-component', {
                template() {
                    return `<div>hello world</div>`;
                },
                drawOther() {
                    if (this.other) return;

                    this.other = this.mount(`<second-component></second-component>`);

                    console.log('component mounted');

                    setTimeout(()=>{
                        this.other.unmount();
                    },1000);

                    this.other.onUnmount = function () {
                        console.log('component unmounted');
                        this.mount();
                        done();
                    };
                },
                removeOther() {
                    if (this.other) {
                        this.other.unmount();
                    }
                },
                onCreate() {
                    setTimeout(()=>{
                        this.drawOther();
                        console.log('AFTER', document.body.innerHTML);
                    },1000);
                }
            });

            Doz.component('second-component', {
                props: {
                    state: false
                },
                template() {
                    return `<button onclick="this.toggle()"><i class="fa fa-volume-${this.props.state ? 'off' : 'up'}"></i></button>`;
                },
                toggle() {
                    this.props.state = !this.props.state;
                }
            });

            new Doz({
                root: '#app',
                template: `<fist-component></fist-component>`
            });
        });
    });
});