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
                props: {
                    rows: [0,1,2]
                },
                template(h) {
                    return h`
                        <div>
                            Hello Doz 
                            <span>a span tag</span>
                            <x-child-a/>
                            ${this.each(this.props.rows, i => h`<x-child-b v="${i}" />`)}
                        </div>`
                },
                onMount() {
                    setTimeout(()=>{
                        this.props.rows.push(3);
                        this.props.rows.push(4);
                        this.render();
                    }, 100);
                }
            });

            Doz.component('x-child-a', {
                template() {
                    return `<div>child a</div>`
                }
            });

            Doz.component('x-child-b', {
                onCreate() {
                    be.err.equal(this.parent.tag, 'x-parent');
                },
                template() {
                    return `<div>child b ${this.props.v}</div>`
                }
            });

            Doz.component('x-child-c', {
                onCreate() {
                    console.log(this.parent.tag)
                },
                template() {
                    return `<div>child a</div>`
                }
            });

            const view = new Doz({
                root: '#app',
                template: `
                    <div>
                        <x-parent/>
                    </div>
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