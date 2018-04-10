const {transform} = require('../src/vdom/parser');
const {updateElement} = require('../src/vdom/index');
const html = require('../src/utils/html');
const observer = require('../src/component/observer');
const Doz = require('../');

describe('speed test', function () {

    this.timeout(0);

    before(function () {
        this.jsdom = require('jsdom-global')()
    });

    after(function () {
        this.jsdom()
    });

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('html create', function () {
        it('should be return nodes, only html element', function () {
            console.time('test');
            for (let i = 0; i < 1000; i++)
                html.create(`<div id="app"></div>`);
            console.timeEnd('test');
        });
    });

    describe('transform html to vdom', function () {
        it('should be return nodes, transform html to vdom', function () {
            console.time('test');
            for (let i = 0; i < 1000; i++)
                transform(html.create(`<div id="app"></div>`));
            console.timeEnd('test');
        });
    });

    describe('updateElement', function () {
        it('should be update', function () {
            console.time('test');
            let prev = null;

            for (let i = 0; i < 10; i++) {
                let tpl = html.create(`<div><ul>${Array.from(Array(1000).keys()).map(item => `<li>${item}</li>`).join('')}</ul></div>`);
                let next = transform(tpl);

                console.log(next.children[0].children.length)

                updateElement(document.body, next, prev, 0, this);

                prev = next;
            }

            console.timeEnd('test');
        });
    });

    describe('observer', function () {
        it('should be return nodes, transform html to vdom', function () {
            console.time('test');
            const cmp = {
                cfg: {
                    props: {
                        record: []
                    }
                }
            };

            const instance = Object.assign({}, cmp.cfg);

            //console.log(instance.props);

            instance.props = observer.create(cmp.cfg.props, false, change => {
                //console.log('cambio');
            });

            observer.beforeChange(instance.props, change => {
                //console.log('before change')
            });

            for (let i = 0; i < 1000; i++)
                instance.props.record.push({i});

            console.timeEnd('test');
        });
    });

    describe('Doz', function () {
        it('should be return nodes, transform html to vdom', function () {
            console.time('test');

            document.body.innerHTML = '<div id="app"></div>';

            Doz.component('doz-todo',{
                template() {
                    return (
                        `<div>
                    <input oninput="this.getTodo()" type="text"><button onclick="this.addItem()" >Add item </button>
                    <ul>
                    ${this.each(this.props.record, (item, i) =>
                            `<li>
                            <button onclick="this.removeItem(${i})">X</button>
                            <button onclick="this.markAsRead(${i})">R</button> <strong>${item.title}</strong>
                         </li>`)}
                    </ul>
                </div>`
                    );
                },

                props: {
                    time: new Date().toLocaleTimeString(),
                    record: [],
                    todo: ''
                },

                getTodo(e) {
                    this.props.todo = e.target.value;
                },

                markAsRead(arg) {
                    this.props.record[parseInt(arg[0])].title = 'READ';
                },

                addItem() {
                    if (this.props.todo) {
                        this.props.record.push({
                            title: this.props.todo
                        });
                    }
                },

                removeItem(arg) {
                    this.props.record.splice([parseInt(arg[0])], 1);
                },

                onRender() {
                    let tmpRecord = [];
                    console.log('R E N D E R');
                    for(let i = 0; i < 200; i++) {
                        tmpRecord.push({title: Math.random()})
                    }

                    this.props.record = tmpRecord;

                    tmpRecord.splice(100, 1);

                    this.props.record = tmpRecord;
                }
            });

            new Doz({
                root: document.getElementById('app'),
                template: `<doz-todo></doz-todo>`
            });

            console.timeEnd('test');
        });
    });
});