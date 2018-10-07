const Doz = require('../index');
const be = require('bejs');

describe('Doz.use', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const myPluginAddCiao = function(Doz) {
                Doz.mixin({
                    myCiao2() {
                        done();
                        return 'Ciao'
                    }
                });
            };

            Doz.use(myPluginAddCiao);

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.myCiao2()} ${this.props.title} ${this.props.name}</div>
                    `
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

        });

        it('should be ok, with options', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            const myPluginAddCiao = function(Doz, app, opt) {
                Doz.mixin({
                    myCiao3() {
                        return `Ciao ${opt.name}`
                    }
                });
            };

            Doz.use(myPluginAddCiao, {
                name: 'Blat &'
            });

            Doz.component('salutation-card', {
                template() {
                    return `
                        <div>${this.myCiao3()} ${this.props.title} ${this.props.name}</div>
                    `
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

            setTimeout(()=>{
                const result = document.body.innerHTML;
                console.log(result);
                be.err(done).true(/Ciao Blat/.test(result));
            }, 100);

        });
    });
});