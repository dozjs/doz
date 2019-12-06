const {directive} = require('../../index');
const wait = require('../../../utils/wait');
const animate = require('./animate');

directive('animate', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            animate: {
                value: animate,
                enumerable: true
            },
            elementsWithAnimation: {
                value: new Map(),
                writable: true
            }
        });
    },

    createAnimations(instance, $target, directiveValue) {
        if ($target.__lockedForAnimation) return;
        $target.__lockedForAnimation = true;

        if (typeof directiveValue === 'string') {
            directiveValue = {
                show: directiveValue,
                hide: directiveValue
            }
        }

        $target.__animationDirectiveValue = directiveValue;

        if (directiveValue.show) {

            if (typeof directiveValue.show !== 'object') {
                directiveValue.show = {
                    name: directiveValue.show
                };
            }

            let optAnimation = {
                duration: directiveValue.show.duration,
                delay: directiveValue.show.delay,
                iterationCount: directiveValue.show.iterationCount,
            };

            wait(() => {
                //console.log('wait enter', $target.__animationIsRunning, document.body.contains($target));
                return !$target.__animationIsRunning;
            }, () => {
                if (!document.body.contains($target)) return;
                if ($target.__animationOriginDisplay) {
                    $target.style.display = $target.__animationOriginDisplay;
                }
                instance.animate($target, directiveValue.show.name, optAnimation);
            });
        }

        if (directiveValue.hide) {

            if (typeof directiveValue.hide !== 'object') {
                directiveValue.hide = {
                    name: directiveValue.hide
                };
            }

            instance.lockRemoveInstanceByCallback = (callerMethod, ...args) => {
                let animationsEnd = [];
                for (let [key, value] of instance.elementsWithAnimation) {
                    let $targetOfMap = key;
                    let directiveValueOfMap = value;

                    animationsEnd.push(
                        new Promise(resolve => {
                                wait(() => {
                                    return !$targetOfMap.__animationIsRunning;
                                }, () => {
                                    if (!document.body.contains($targetOfMap)) return;
                                    let optAnimation = {
                                        duration: directiveValueOfMap.hide.duration,
                                        delay: directiveValueOfMap.hide.delay,
                                        iterationCount: directiveValueOfMap.hide.iterationCount,
                                    };
                                    instance.animate($targetOfMap, directiveValueOfMap.hide.name, optAnimation, () => {
                                        $targetOfMap.style.display = 'none';
                                        resolve();
                                    });
                                });
                            }
                        )
                    );
                }

                Promise.all(animationsEnd).then(() => {
                    instance.lockRemoveInstanceByCallback = null;
                    callerMethod.apply(instance, args);
                }, reason => {
                    throw new Error(reason);
                });
            }
        }

        if (!instance.elementsWithAnimation.has($target))
            instance.elementsWithAnimation.set($target, directiveValue);
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.createAnimations(instance, $target, directiveValue)
    },

    onAppComponentMount(instance) {
        for (let [key, value] of instance.elementsWithAnimation) {
            this.createAnimations(instance, key, value)
        }
    }
});