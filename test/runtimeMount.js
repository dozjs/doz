const Doz = require('../index');
const be = require('bejs');

describe('runtimeMount', function () {

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

                    this.other = this.mount(this.h`
                        <div>
                            <second-component></second-component>
                            <thirty-component></thirty-component>
                        </div>
                    `);

                    //console.log('component mounted');
                    done();
                    this.other.onDestroy = function () {
                        //console.log('component destroyed');
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
                        //console.log('AFTER', document.body.innerHTML);
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

            let firstHtml = '';

            Doz.component('fist-component', {
                template() {
                    return `<div>hello world</div>`;
                },
                drawOther() {
                    if (this.other) return;

                    this.other = this.mount(`<second-component></second-component>`);

                    setTimeout(()=>{
                        this.other.unmount();
                    },1000);

                    this.other.onUnmount = function () {
                        this.mount();
                    };

                    this.other.onMount = function () {
                        be.err.equal(document.body.innerHTML, firstHtml);
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
                        firstHtml = document.body.innerHTML;
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
                },
                onMount() {
                    //console.log('MOUNT SECOND')
                }
            });

            new Doz({
                root: '#app',
                template: `<fist-component></fist-component>`
            });
        });
    });
});