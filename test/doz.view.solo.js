const Doz = require('../index');
const be = require('bejs');


describe('Doz.view.solo', function () {

    this.timeout(5000);

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

    describe('create only app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const view = new Doz({
                root: '#app',
                props: {
                    title: 'Hello world'
                },
                template() {
                    return `<div>${this.props.title}</div>`
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                console.log(view);
                be.err(done).true(/Hello world/g.test(html));
            },100);

        });

    });
});