const {directive} = require('../index');
const wait = require('../../utils/wait');

function animate(node, animationName, callback) {

    let computedStyle = window.getComputedStyle(node);
    node.classList.add('animated', animationName);

    if (computedStyle.display === 'inline') {
        node.style.display = 'inline-block';
    }

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
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

        if (typeof directiveValue === 'string') {
            directiveValue = {
                show: directiveValue,
                hide: directiveValue
            }
        }

        $target.__animationDirectiveValue = directiveValue;

        if (directiveValue.show) {
            wait(() => {
                //console.log('wait enter', $target.__animationIsRunning, document.body.contains($target));
                return !$target.__animationIsRunning;
            }, () => {
                if (!document.body.contains($target)) return;
                $target.__animationIsRunning = true;
                if ($target.__animationOriginDisplay) {
                    $target.style.display = $target.__animationOriginDisplay;
                }
                instance.animate($target, directiveValue.show, () => {
                    $target.__animationIsRunning = false;
                    $target.__animationEnterIsComplete = true;
                    $target.__lokedForAnimation = false;
                });
            });
            if (!instance.elementsWithAnimation.has($target))
                instance.elementsWithAnimation.set($target, directiveValue);
        }
        if (directiveValue.hide) {
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
                                    instance.animate($targetOfMap, directiveValueOfMap.hide, () => {
                                        //console.error('animation ends', $targetOfMap)
                                        $targetOfMap.__animationOriginDisplay = $targetOfMap.style.display;
                                        $targetOfMap.style.display = 'none';
                                        $targetOfMap.__animationIsRunning = false;
                                        $targetOfMap.__lokedForAnimation = false;
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
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        if ($target.__lokedForAnimation) return;
        $target.__lokedForAnimation = true;
        this.createAnimations(instance, $target, directiveValue)
    },

    /*
    onComponentMount(instance, directiveValue) {
        let $target = instance.getHTMLElement();
        if ($target.__lokedForAnimation) return;

        if (instance.parent && instance.parent.elementsWithAnimation.length)
            instance = instance.parent;
        $target.__lokedForAnimation = true;
        this.createAnimations(instance, $target, directiveValue)
    },
    */

    onAppComponentMount(instance) {
        for (let [key, value] of instance.elementsWithAnimation) {
            let $target = key;
            let directiveValue = value;
            if ($target.__lokedForAnimation) continue;
            $target.__lokedForAnimation = true;
            this.createAnimations(instance, $target, directiveValue)
        }
    }
});