import index from "../../index.js";
import { extractStyleDisplayFromDozProps } from "../../helpers.js";
import queue from "../../../utils/queue.js";
import delay from "../../../utils/delay.js";
const { directive } = index;
function show($target, opt) {
}
function hide($target, opt) {
}
directive('show', {
    onAppComponentCreate(instance) {
        /*Object.defineProperties(instance, {
            show: {
                value: show,
                writable: true,
                enumerable: true
            },
            hide: {
                value: hide,
                writable: true,
                enumerable: true
            }
        });*/
    },
    setVisible($target, value) {
        const thereIsAnimateDirective = $target._dozAttach.__animationDirectiveValue;
        $target._dozAttach.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';
        let lockAnimation = false;
        if ($target._dozAttach.__showInitialValue === undefined) {
            $target._dozAttach.__showInitialValue = value;
            lockAnimation = !value;
        }
        //$target.__animationWasUsed =
        //console.dir($target);
        if ($target._dozAttach.__prevValueOfShow === value)
            return;
        $target._dozAttach.__prevValueOfShow = value;
        //if (thereIsAnimateDirective && !lockAnimation/*&& $target._dozAttach.__prevValueOfShow !== value*/ && $target._dozAttach.__animationWasUsedByShowDirective) {
        if (thereIsAnimateDirective && !lockAnimation) {
            //console.log($target._dozAttach.__animationIsRunning)
            if (!$target._dozAttach.__animationsList)
                $target._dozAttach.__animationsList = [];
            $target._dozAttach.__animationUsedByShowDirective = true;
            $target._dozAttach.__animationsList.push((resolve) => {
                //console.log('value', value)
                if (value) {
                    $target.style.display = $target._dozAttach.__showOriginDisplay;
                    $target._dozAttach.__animationShow(() => {
                        $target.style.display = $target._dozAttach.__showOriginDisplay;
                        //$target._dozAttach.__prevValueOfShow = value;
                        $target._dozAttach.__animationUsedByShowDirective = false;
                        resolve();
                    });
                }
                else {
                    $target._dozAttach.__animationHide(() => {
                        $target.style.display = 'none';
                        //$target._dozAttach.__prevValueOfShow = value;
                        $target._dozAttach.__animationUsedByShowDirective = false;
                        resolve();
                    });
                }
            });
            //console.log($target._dozAttach.__animationsList)
            if (thereIsAnimateDirective.queue) {
                if (!$target._dozAttach.__animationIsRunning) {
                    // please don't use it
                    queue($target._dozAttach.__animationsList.shift(), $target._dozAttach.__animationsList);
                }
            }
            else {
                new Promise($target._dozAttach.__animationsList.shift()).then();
            }
        }
        else {
            //$target._dozAttach.__prevValueOfShow = value;
            //if (thereIsAnimateDirective)
            //$target._dozAttach.__animationWasUsedByShowDirective = true;/**/
            //delay(() => {
            $target.style.display = !value /*=== false*/ ? 'none' : $target._dozAttach.__showOriginDisplay;
            //});
        }
    },
    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },
    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },
});
