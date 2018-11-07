const Doz = require('../index');
const be = require('bejs');

describe('Doz.parent', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component and parent', function () {

        it('should be ok with a nested component', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('x-parent', {
                onCreate() {
                    console.log(this.tag, this.parent.tag)
                },
                props: {
                    rows: [0,1,2]
                },
                template(h) {
                    return h`
                            <x-prev/>
                            <span>Hello Doz a span tag</span>
                            <x-child-a/>
                            ${this.each(this.props.rows, i => h`<x-child-b v="${i}" />`)}
                        `
                },
                onMount() {
                    setTimeout(()=>{
                        this.props.rows.push(3);
                        this.props.rows.push(4);
                        this.render();
                    }, 100);
                }
            });

            Doz.component('x-clear', {
                onCreate() {
                    console.log(this.tag, this.parent.tag)
                },
                template() {
                    return `<div style="clear:both"></div>`
                }
            });

            Doz.component('x-child-a', {
                onCreate() {
                    console.log(this.tag, this.parent.tag)
                },
                template() {
                    return `<div>child a</div>`
                }
            });

            Doz.component('x-child-b', {
                onCreate() {
                    be.err.equal(this.parent.tag, 'x-parent');
                },
                template() {
                    return `<div><x-clear/>child b ${this.props.v}<x-child-c/></div>`
                }
            });

            Doz.component('x-child-c', {
                onCreate() {
                    console.log(this.tag, this.parent.tag)
                },
                template() {
                    return `<div>child a</div>`
                }
            });

            Doz.component('x-prev', {
                onCreate() {
                    console.log(this.tag, this.parent.tag)
                },
                template() {
                    return `<div>prev</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <x-parent/>
                    <div></div>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                done()
            },500);


        });

    });
});