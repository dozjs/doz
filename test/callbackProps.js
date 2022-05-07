const Doz = require('../index');
const be = require('bejs');

describe('Doz.callback', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app with component callback', function () {

        it('should be ok with function', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('prev-cmp', {
                template(h) {
                    return h`<div>ok</div>`
                }
            });

            Doz.component('salutation-card', {
                template(h) {
                    return h`
                        <div>
                            <prev-cmp/>
                            <div>
                                Hello ${this.props.title} ${this.props.name} 
                                <caller-o d:on-mycallback="${this.aCallback}"></caller-o>
                            </div>
                        </div>`
                },
                aCallback: function(arg) {
                    //console.log('callback is called', arg, this.template);
                    be.err(done).equal(arg, 'hello');
                }
            });

            Doz.component('caller-o', {
                template(h) {
                    return h`<div>Callback</div>`
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
                template(h) {
                    return h`
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `}
            });

            console.log(document.body.innerHTML)
        });
        it('should be ok with function as string', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('prev-cmp', {
                template(h) {
                    return h`<div>ok</div>`
                }
            });

            Doz.component('salutation-card', {
                template(h) {
                    return h`
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
                template(h) {
                    return h`<div>Callback</div>`
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
                template(h) {
                    return h`
                    <salutation-card
                        title="MR."
                        name="Doz">
                    </salutation-card>
                `}
            });

            console.log(document.body.innerHTML)
        });
    });
});