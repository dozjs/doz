const Doz = require('../index');
const be = require('bejs');

describe('multipleApp', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok', function (done) {

            document.body.innerHTML = `
                <div id="app1"></div>
                <div id="app2"></div>
            `;

            const app1 = new Doz({
                root: '#app1',
                template(h) {
                    return h`
                    <style> 
                        button {
                            color: green
                        }
                    </style>
                    <button>Button app 1</button>
                `
                }
            });

            const app2 = new Doz({
                root: '#app2',
                template(h) {
                    return h`
                    <style> 
                        button {
                            color: red
                        }
                    </style>
                    <button>Button app 2</button>
                `
                }
            });

            setTimeout(() => {
                //console.log(document.getElementById('app1').innerHTML)
                be.err.not.null(document.getElementById(app1.appId + '-1--style'));
                be.err.not.null(document.getElementById(app2.appId + '-1--style'));
                be.err.not.empty(document.getElementById('app1').innerHTML);
                be.err.not.empty(document.getElementById('app2').innerHTML);
                //console.log(document.body.innerHTML);
                done();
            }, 100);
        });
    });
});