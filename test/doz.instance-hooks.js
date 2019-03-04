const Doz = require('../index');
const be = require('bejs');


describe('Doz.instance.hooks', function () {

    beforeEach(function () {
        document.body.innerHTML = '';
        Doz.collection.removeAll();
    });

    describe('create app', function () {

        it('should be ok, EVENT', function (done) {

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            const queueEvents = [];
            const shouldBe = [
                'onBeforeCreate',
                'onCreateProto',
                'onCreate',
                'onBeforeMount',
                'onAfterRender',
                'onMountProto',
                'onMount',
                'onBeforeUpdate',
                'onUpdateProto',
                'onUpdate',
                'onBeforeUnmount',
                'onUnmountProto',
                'onUnmount',
                'onBeforeDestroy',
                'onDestroyProto',
                'onAfterRender',
                'onMountAsyncProto',
                'onMountAsync',
                'onDestroy'
            ];

            Doz.component('my-cmp-instance', class extends Doz.Component {
                template(h) {
                    return h`
                        <div>${this.props.title}</div>
                    `
                }

                onCreate() {
                    queueEvents.push('onCreateProto');
                }

                onMount() {
                    queueEvents.push('onMountProto');
                }

                onMountAsync() {
                    queueEvents.push('onMountAsyncProto');
                }

                onUpdate() {
                    queueEvents.push('onUpdateProto');
                }

                onUnmount() {
                    queueEvents.push('onUnmountProto');
                }

                onDestroy() {
                    queueEvents.push('onDestroyProto');
                }

            });

            new Doz({
                root: '#app',
                props: {
                    title: 'Hello world'
                },
                template() {
                    return `
                        <my-cmp-instance 
                            title="${this.props.title}"
                            d:onbeforecreate="onMyCmpBeforeCreate"
                            d:oncreate="onMyCmpCreate"
                            d:onbeforemount="onMyCmpBeforeMount"
                            d:onmount="onMyCmpMount"
                            d:onmountasync="onMyCmpMountAsync"
                            d:onafterrender="onMyCmpAfterRender"
                            d:onbeforeupdate="onMyCmpBeforeUpdate"
                            d:onupdate="onMyCmpUpdate"
                            d:onbeforeunmount="onMyCmpBeforeUnmount"
                            d:onunmount="onMyCmpUnmount"
                            d:onbeforedestroy="onMyCmpBeforeDestroy"
                            d:ondestroy="onMyCmpDestroy"
                        />`
                },
                onMyCmpBeforeCreate() {
                    queueEvents.push('onBeforeCreate');
                },
                onMyCmpCreate() {
                    queueEvents.push('onCreate');
                },
                onMyCmpBeforeMount() {
                    queueEvents.push('onBeforeMount');
                },
                onMyCmpMount() {
                    queueEvents.push('onMount');
                    this.props.title = 'ciao';
                },
                onMyCmpMountAsync() {
                    queueEvents.push('onMountAsync');
                },
                onMyCmpAfterRender() {
                    queueEvents.push('onAfterRender');
                },
                onMyCmpBeforeUpdate() {
                    queueEvents.push('onBeforeUpdate');
                },
                onMyCmpUpdate(cmp) {
                    queueEvents.push('onUpdate');
                    cmp.destroy();
                },
                onMyCmpBeforeUnmount() {
                    queueEvents.push('onBeforeUnmount');
                },
                onMyCmpUnmount() {
                    queueEvents.push('onUnmount');
                },
                onMyCmpBeforeDestroy() {
                    queueEvents.push('onBeforeDestroy');
                },
                onMyCmpDestroy() {
                    setTimeout(function () {
                        queueEvents.push('onDestroy');
                        //console.log(queueEvents, shouldBe);
                        be.err(done).equal(queueEvents, shouldBe);
                    }, 100);
                }
            });
        });

    });
});