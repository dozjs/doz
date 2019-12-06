const {directive} = require('../index');
const wait = require('../../utils/wait');

function animate(node, animationName, opts, callback) {

    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    } else if (!opts) {
        opts = {};
    }

    let computedStyle = window.getComputedStyle(node);
    // Now supports IE11
    node.classList.add('animated');
    node.classList.add(animationName);

    if (computedStyle.display === 'inline') {
        node.style.display = 'inline-block';
    }

    function handleAnimationEnd() {
        node.classList.remove('animated');
        node.classList.remove(animationName);
        node.style.display = computedStyle.display;
        node.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd);
}

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
        if ($target.__lokedForAnimation) return;
        $target.__lokedForAnimation = true;

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

            if (directiveValue.show.duration) {
                $target.style.animationDuration = directiveValue.show.duration;
                $target.style.webkitAnimationDuration = directiveValue.show.duration;
            }

            if (directiveValue.show.delay) {
                $target.style.animationDelay = directiveValue.show.delay;
                $target.style.webkitAnimationDelay = directiveValue.show.delay;
            }

            if (directiveValue.show.iterationCount) {
                $target.style.animationIterationCount = directiveValue.show.iterationCount;
                $target.style.webkitAnimationIterationCount = directiveValue.show.iterationCount;
            }

            wait(() => {
                //console.log('wait enter', $target.__animationIsRunning, document.body.contains($target));
                return !$target.__animationIsRunning;
            }, () => {
                if (!document.body.contains($target)) return;
                $target.__animationIsRunning = true;
                if ($target.__animationOriginDisplay) {
                    $target.style.display = $target.__animationOriginDisplay;
                }
                instance.animate($target, directiveValue.show.name, () => {
                    $target.__animationIsRunning = false;
                    $target.__animationEnterIsComplete = true;
                    $target.__lokedForAnimation = false;

                    $target.style.animationDuration = '';
                    $target.style.animationDelay = '';
                    $target.style.animationIterationCount = '';

                    $target.style.webkitAnimationDuration = '';
                    $target.style.webkitAnimationDelay = '';
                    $target.style.webkitAnimationIterationCount = '';
                });
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
                                    $targetOfMap.__animationIsRunning = true;

                                    if (directiveValueOfMap.hide.duration) {
                                        $targetOfMap.style.animationDuration = directiveValueOfMap.hide.duration;
                                        $targetOfMap.style.webkitAnimationDuration = directiveValueOfMap.hide.duration;
                                    }

                                    if (directiveValueOfMap.hide.delay) {
                                        $targetOfMap.style.animationDelay = directiveValueOfMap.hide.delay;
                                        $targetOfMap.style.webkitAnimationDelay = directiveValueOfMap.hide.delay;
                                    }

                                    if (directiveValueOfMap.hide.iterationCount) {
                                        $targetOfMap.style.animationIterationCount = directiveValueOfMap.hide.iterationCount;
                                        $targetOfMap.style.webkitAnimationIterationCount = directiveValueOfMap.hide.iterationCount;
                                    }

                                    instance.animate($targetOfMap, directiveValueOfMap.hide.name, () => {
                                        //console.error('animation ends', $targetOfMap)
                                        $targetOfMap.__animationOriginDisplay = $targetOfMap.style.display;
                                        $targetOfMap.style.display = 'none';
                                        $targetOfMap.__animationIsRunning = false;
                                        $targetOfMap.__lokedForAnimation = false;

                                        $targetOfMap.style.animationDuration = '';
                                        $targetOfMap.style.animationDelay = '';
                                        $targetOfMap.style.animationIterationCount = '';

                                        $targetOfMap.style.webkitAnimationDuration = '';
                                        $targetOfMap.style.webkitAnimationDelay = '';
                                        $targetOfMap.style.webkitAnimationIterationCount = '';
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