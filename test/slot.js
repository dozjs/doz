import Doz from "../src/index.js";
import be from "bejs";

describe('slot', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <slot name="header">default header</slot>
                        </div>
                        <div>
                            <slot name="body">default body</slot>
                        </div>
                        <div>
                            <slot name="footer">default footer</slot>
                        </div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div>
                            <salutation-card>
                                <h1 slot="header">Hello</h1>
                                <p slot="body">Lorem Ipsum Dolor Sit</p>
                                <div slot="footer">Copyright</div>
                            </salutation-card>
                        </div>
                    `
                }/*,
                onMountAsync() {
                    //this.render(false, [], true)
                }*/
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err.equal(html, '<div id="app"><dz-app><div><salutation-card><!--slot(header)--><!--slot(body)--><!--slot(footer)--><dz-root><div><h1>Hello</h1></div><div><p>Lorem Ipsum Dolor Sit</p></div><div><div>Copyright</div></div></dz-root></salutation-card></div></dz-app></div>');
                done()
            },100);
        });

        it('should be ok with default slot', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <slot name="header">default header</slot>
                        </div>
                        <div>
                            <slot name="body">default body</slot>
                        </div>
                        <div>
                            <slot name="footer">default footer</slot>
                        </div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div>
                            <salutation-card>
                                <h1 slot="header">Hello</h1>
                                <div slot="footer">Copyright</div>
                            </salutation-card>
                        </div>
                    `
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err.equal(html, '<div id="app"><dz-app><div><salutation-card><!--slot(header)--><!--slot(footer)--><dz-root><div><h1>Hello</h1></div><div><dz-slot>default body</dz-slot></div><div><div>Copyright</div></div></dz-root></salutation-card></div></dz-app></div>');
                done()
            },100);
        });

        it('should be ok with slot unnamed', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <slot>default position</slot>
                        </div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div>
                            <salutation-card>
                                <div>
                                    <h1>Hello</h1>
                                </div>
                            </salutation-card>
                        </div>
                    `
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err.equal(html, '<div id="app"><dz-app><div><salutation-card><!--slot--><div><div><h1>Hello</h1></div></div></salutation-card></div></dz-app></div>');
                done()
            },100);
        });

        it('should be ok with slot unnamed using mount method', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <slot>default position</slot>
                        </div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <div></div>
                    `
                },
                onMount() {
                    this.mount(this.h`
                        <salutation-card>
                            <h1>Hello</h1>
                        </salutation-card>
                    `)
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                //console.log(html);
                be.err.equal(html, '<div id="app"><dz-app><div><dz-mount><salutation-card><!--slot--><div><h1>Hello</h1></div></salutation-card></dz-mount></div></dz-app></div>');
                done()
            },100);
        });
    });
});