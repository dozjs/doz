import Doz from "../src/index.js";
import be from "bejs";

describe('instanceHooks', function () {

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
                'onCreate',
                'onCreateProto',
                'onBeforeMount',
                'onAfterRender',
                'onMount',
                'onMountProto',
                'onBeforeUpdate',
                'onMountAsync',
                'onMountAsyncProto',
                'onUpdate',
                'onBeforeUnmount',
                'onUnmount',
                'onUnmountProto',
                'onBeforeDestroy',
                'onDestroyProto',
                'onUpdateProto',
                'onAfterRender',
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
                    //console.log('onBeforeCreate');
                    queueEvents.push('onBeforeCreate');
                },
                onMyCmpCreate() {
                    //console.log('onCreate');
                    queueEvents.push('onCreate');
                },
                onMyCmpBeforeMount() {
                    //console.log('onBeforeMount');
                    queueEvents.push('onBeforeMount');
                },
                onMyCmpMount() {
                    //console.log('onMount');
                    queueEvents.push('onMount');
                    this.props.title = 'ciao';
                },
                onMyCmpMountAsync() {
                    //console.log('onMountAsync');
                    queueEvents.push('onMountAsync');
                },
                onMyCmpAfterRender() {
                    //console.log('onAfterRender');
                    queueEvents.push('onAfterRender');
                },
                onMyCmpBeforeUpdate() {
                    //console.log('onBeforeUpdate');
                    queueEvents.push('onBeforeUpdate');
                },
                onMyCmpUpdate(cmp) {
                    //console.log('onUpdate');
                    queueEvents.push('onUpdate');
                    cmp.destroy();
                },
                onMyCmpBeforeUnmount() {
                    //console.log('onBeforeUnmount');
                    queueEvents.push('onBeforeUnmount');
                },
                onMyCmpUnmount() {
                    //console.log('onUnmount');
                    queueEvents.push('onUnmount');
                },
                onMyCmpBeforeDestroy() {
                    //console.log('onBeforeDestroy');
                    queueEvents.push('onBeforeDestroy');
                },
                onMyCmpDestroy() {
                    setTimeout(function () {
                        //console.log('onDestroy');
                        queueEvents.push('onDestroy');
                        //console.log(queueEvents, shouldBe);
                        be.err(done).equal(queueEvents, shouldBe);
                    }, 100);
                }
            });
        });

    });
});