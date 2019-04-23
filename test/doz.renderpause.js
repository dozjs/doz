const Doz = require('../index');
const be = require('bejs');

describe('Doz.renderpause', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('x-parent', {
                id: 'x-parent',
                props: {
                    first: 'Hello',
                    second: 'World'
                },
                template(h) {
                    return h`
                        <div>
                            ${this.props.first}
                            ${this.props.second}
                        </div>`
                },
                onMount() {
                    this.renderPause();
                    this.props.first = 'Ciao';
                    this.props.second = 'Mondo';
                }
            });

            const app = new Doz({
                root: '#app',
                template: `
                    <div>
                        <x-parent/>
                    </div>
                `
            });

            setTimeout(()=>{
                let html = document.body.innerHTML;
                console.log(html);
                be.err.equal('<div id="app"><dz-app><div> <x-parent><div> Hello World </div></x-parent> </div></dz-app></div>', html);
                be.err.true(app.getComponentById('x-parent').isRenderPause);
                app.getComponentById('x-parent').renderResume();
                html = document.body.innerHTML;
                console.log(html);
                be.err.equal('<div id="app"><dz-app><div> <x-parent><div> Ciao Mondo </div></x-parent> </div></dz-app></div>', html);
                be.err.false(app.getComponentById('x-parent').isRenderPause);
                done();
            },500);


        });

    });
});