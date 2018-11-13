const Doz = require('../index');
const be = require('bejs');

describe('Doz.callback', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component callback', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('prev-cmp', {
                template() {
                    return '<div>ok</div>'
                }
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>
                            <prev-cmp/>
                            <div>
                                Hello ${this.props.title} ${this.props.name} 
                                <caller-o d:on-mycallback="aCallback"></caller-o>
                            </div>
                        </div>`
                },
                aCallback: function(arg) {
                    console.log('callback is called', arg);
                    be.err(done).equal(arg, 'hello');
                }
            });

            Doz.component('caller-o', {
                template() {
                    return `<div>Callback</div>`
                },
                onCreate() {
                    console.log('created');
                    setTimeout(()=>{
                        this.emit('mycallback', 'hello');
                    },1000);
                    console.log(this.parent.tag)
                }
            });

            new Doz({
                root: '#app',
                template: `
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `
            });

            console.log(document.body.innerHTML)
        });
    });
});