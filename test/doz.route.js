const Doz = require('../index');
const be = require('bejs');

describe('Doz.route', function () {

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

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('home-page', {
                template() {
                    return `
                        <div>I'm home page</div>
                    `
                }
            });

            Doz.component('about-page', {
                template() {
                    return `
                        <div>I'm about page</div>
                    `
                }
            });

            Doz.component('contact-page', {
                template() {
                    return `
                        <div>I'm contact page</div>
                    `
                }
            });

            Doz.component('doz-routes', {
                onAppReady() {
                    console.log(this._rootElement.parentNode.innerHTML)
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <nav>
                        <a href="#/home">Home</a> 
                        <a href="#/about">About</a> 
                        <a href="#/contact">Contact</a> 
                    </nav>
                    <doz-routes>
                        <home-page d:route="/home"></home-page>
                        <about-page d:route="/about"></about-page>
                        <contact-page d:route="/contact"></contact-page>
                    </doz-routes>
                `
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                done();
                //const emptyTag = document.body.querySelectorAll('doz-empty');
                //be.err(done).equal(emptyTag.length, 1);
            },100);
        });
    });
});