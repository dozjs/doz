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
        //instance.elementsWithAnimation = [];
        //console.log(instance, $target)
        if (directiveValue.enter) {
            wait(() => {
                //console.log('wait enter');
                return !$target.__animationIsRunning;
            }, () => {
                $target.__animationIsRunning = true;
                if($target.__animationOriginDisplay) {
                    $target.style.display = $target.__animationOriginDisplay;
                }
                instance.animate($target, directiveValue.enter, () => {
                    $target.__animationIsRunning = false;
                    $target.__animationEnterIsComplete = true;
                });
            });
            if (!instance.elementsWithAnimation.has($target))
                instance.elementsWithAnimation.set($target, directiveValue);
        }
        if (directiveValue.leave) {
            // Use instance.parent as instance... boh why?
            if (instance.parent && instance.parent.tag === 'dz-mount')
                instance = instance.parent;
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
                                    $targetOfMap.__animationIsRunning = true;
                                    instance.animate($targetOfMap, directiveValueOfMap.leave, () => {
                                        //console.error('animation ends', $targetOfMap)
                                        $targetOfMap.__animationOriginDisplay = $targetOfMap.style.display;
                                        $targetOfMap.style.display = 'none';
                                        $targetOfMap.__animationIsRunning = false;
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
        this.createAnimations(instance, $target, directiveValue)
    },

    onComponentMount(instance, directiveValue) {
        let $target = instance.getHTMLElement();
        if ($target.__animationOriginDisplay) {
            console.log(instance.parent)
            this.createAnimations(instance, $target, directiveValue)
        }

    }
});