const {directive} = require('../../index');
const wait = require('../../../utils/wait');
const animateHelper = require('./animate-helper');

directive('animate', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            animate: {
                value: animateHelper,
                enumerable: true
            },
            elementsWithAnimation: {
                value: new Map(),
                writable: true
            }
        });
    },

    createLockRemoveInstanceByCallback(instance) {
        instance.lockRemoveInstanceByCallback = (callerMethod, ...args) => {
            if (instance.lockRemoveInstanceByCallbackIsCalled) return;
            instance.lockRemoveInstanceByCallbackIsCalled = true;
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
                instance.lockRemoveInstanceByCallbackIsCalled = false;
                callerMethod.apply(instance, args);
            }, reason => {
                throw new Error(reason);
            });
        }
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

            //Add always an useful method for show
            $target.__animationShow = (cb) => instance.animate($target, directiveValue.show.name, optAnimation, cb);

            wait(() => {
                //console.log('wait enter', $target.__animationIsRunning, document.body.contains($target));
                return !$target.__animationIsRunning;
            }, () => {
                if (!document.body.contains($target)) return;
                if ($target.__animationOriginDisplay) {
                    $target.style.display = $target.__animationOriginDisplay;
                }
                //Exclude if element is not displayed
                if ($target.style.display === 'none') return;
                instance.animate($target, directiveValue.show.name, optAnimation);
            });
        }

        if (directiveValue.hide) {

            if (typeof directiveValue.hide !== 'object') {
                directiveValue.hide = {
                    name: directiveValue.hide
                };
            }

            let optAnimation = {
                duration: directiveValue.hide.duration,
                delay: directiveValue.hide.delay,
                iterationCount: directiveValue.hide.iterationCount,
            };

            //Add always an useful method for show
            $target.__animationHide = (cb) => instance.animate($target, directiveValue.hide.name, optAnimation, cb);

            this.createLockRemoveInstanceByCallback(instance)
        }

        instance.elementsWithAnimation.set($target, directiveValue);

        setTimeout(() => {
            Object.keys(instance.children).forEach(i => {
                const childInstance = instance.children[i];
                const $childTarget = childInstance.getHTMLElement();
                const elementAnimation = instance.elementsWithAnimation.get($childTarget);
                if (elementAnimation) {
                    if (!childInstance.lockRemoveInstanceByCallback) {
                        childInstance.elementsWithAnimation.set($childTarget, elementAnimation);
                        this.createLockRemoveInstanceByCallback(childInstance)
                    }
                }
            })
        })

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