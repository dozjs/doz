const Doz = require('../index');
const be = require('bejs');

describe('Doz.slot', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('x-cmp-1', {
                template(h) {
                    return h`
                        <div>
                            hello
                            <div>
                                <slot/>
                            </div>
                        </div>
                    `
                },
            });

            Doz.component('x-cmp-2', {
                props: {
                    label: 'the label'
                },
                template(h) {
                    return h`
                        <div>
                            ${this.props.label}
                        </div>
                    `
                },
            });

            new Doz({
                root: '#app',
                props: {
                    linkName: 'A link',
                    label: 'test'
                },
                template(h) {
                    return h`
                        <x-cmp-1>
                            <div slot>
                                <a href="#" title="${this.props.linkName}">${this.props.linkName}</a>
                                <x-cmp-2 label="${this.props.label}"/>
                            </div>
                        </x-cmp-1>
                    `;
                }
            });

            setTimeout(()=>{
                const html = document.body.innerHTML;
                console.log(html);
                be.err(done).equal(html, '<div id="app"><dz-app><x-cmp-1><div> hello <div> <slot> <div> <a href="#" title="A link">A link</a> <x-cmp-2><div> test </div></x-cmp-2> </div> </slot> </div> </div></x-cmp-1></dz-app></div>');
            },500);


        });

    });
});