import index from "../../index.js";
import wait from "../../../utils/wait.js";
import animateHelper from "./animate-helper.js";
const { directive } = index;
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
            if (instance.lockRemoveInstanceByCallbackIsCalled)
                return;
            instance.lockRemoveInstanceByCallbackIsCalled = true;
            let animationsEnd = [];
            for (let [key, value] of instance.elementsWithAnimation) {
                let $targetOfMap = key;
                let directiveValueOfMap = value;
                animationsEnd.push(new Promise(resolve => {
                    if (!document.body.contains($targetOfMap))
                        return resolve();
                    wait((cancelWait) => {
                        if ($targetOfMap._dozAttach.__animationUsedByShowDirective) {
                            cancelWait();
                            return true;
                        }
                        return !$targetOfMap._dozAttach.__animationIsRunning;
                    }, () => {
                        let optAnimation = {
                            duration: directiveValueOfMap.hide.duration,
                            delay: directiveValueOfMap.hide.delay,
                            iterationCount: directiveValueOfMap.hide.iterationCount,
                            cb: directiveValueOfMap.hide.cb,
                            classLib: directiveValueOfMap.classLib,
                        };
                        instance.animate($targetOfMap, directiveValueOfMap.hide.name, optAnimation, () => {
                            $targetOfMap.style.display = 'none';
                            resolve();
                        });
                    }, 1000, () => {
                        $targetOfMap._dozAttach.__animationReset();
                    });
                }));
            }
            Promise.all(animationsEnd).then(() => {
                instance.lockRemoveInstanceByCallback = null;
                instance.lockRemoveInstanceByCallbackIsCalled = false;
                callerMethod.apply(instance, args);
            }, reason => {
                throw new Error(reason);
            });
        };
    },
    createAnimations(instance, $target, directiveValue) {
        if ($target._dozAttach.__lockedForAnimation)
            return;
        $target._dozAttach.__lockedForAnimation = true;
        if (typeof directiveValue === 'string') {
            directiveValue = {
                show: directiveValue,
                hide: directiveValue
            };
        }
        $target._dozAttach.__animationDirectiveValue = directiveValue;
        if (directiveValue.show) {
            /**/
            if (typeof directiveValue.show !== 'object') {
                directiveValue.show = {
                    name: directiveValue.show
                };
            }
            let optAnimation = {
                duration: directiveValue.show.duration,
                delay: directiveValue.show.delay,
                iterationCount: directiveValue.show.iterationCount,
                cb: directiveValue.show.cb,
                classLib: directiveValue.classLib,
                mode: 'show'
            };
            //Add always an useful method for show
            $target._dozAttach.__animationShow = (cb) => instance.animate($target, directiveValue.show.name, optAnimation, cb);
            /**/
            //(function ($target, directiveValue, instance) {
            wait((cancelWait) => {
                //console.log($target._dozAttach.__animationIsRunning)
                if ($target._dozAttach.__animationUsedByShowDirective) {
                    cancelWait();
                    return true;
                }
                return !$target._dozAttach.__animationIsRunning;
            }, () => {
                if (!document.body.contains($target))
                    return;
                if ($target._dozAttach.__animationOriginDisplay) {
                    $target.style.display = $target._dozAttach.__animationOriginDisplay;
                }
                //Exclude if element is not displayed
                if ($target.style.display === 'none')
                    return;
                instance.animate($target, directiveValue.show.name, optAnimation);
            }, 1000, () => {
                $target._dozAttach.__animationReset();
            });
            //})($target, directiveValue, instance);
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
                cb: directiveValue.hide.cb,
                classLib: directiveValue.classLib,
                mode: 'hide'
            };
            //Add always an useful method for show
            $target._dozAttach.__animationHide = (cb) => instance.animate($target, directiveValue.hide.name, optAnimation, cb);
            this.createLockRemoveInstanceByCallback(instance);
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
                        this.createLockRemoveInstanceByCallback(childInstance);
                    }
                }
            });
        });
    },
    onComponentDOMElementCreate(instance, $target, directiveValue) {
        //console.log('onComponentDOMElementCreate', 'animation', $target);
        this.createAnimations(instance, $target, directiveValue);
    },
    onAppComponentMount(instance) {
        if (!instance.elementsWithAnimation || !instance.elementsWithAnimation.size)
            return;
        for (let [key, value] of instance.elementsWithAnimation) {
            this.createAnimations(instance, key, value);
        }
    }
});
