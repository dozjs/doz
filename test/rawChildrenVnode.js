const Doz = require('../index');

describe('rawChildrenVnode', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `<div id="app"></div>`;

            Doz.component('my-wrapper', {
                template() {
                    return `
                        <div></div>
                    `
                }
            });

            Doz.component('my-card', {
                template() {
                    return `
                        <div>${this.props.number}</div>
                    `
                }
            });

            new Doz({
                root: '#app',
                template(h) {
                    return h`
                        <h1>Hello</h1>
                        <my-wrapper>
                            <my-card number="${1}"/>
                            <my-card number="${2}"/>
                            <my-card number="${3}"/>
                            <my-card number="${4}"/>
                        </my-wrapper>
                    `
                },

                onMountAsync() {
                    //console.log(this.rawChildren)
                    /*//console.log(this.rawChildrenVnode)
                    //console.log(JSON.stringify(this._prev.children, null, 4))*/
                    done();
                }
            });
        });
    });
});