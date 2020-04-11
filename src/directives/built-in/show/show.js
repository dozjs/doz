const {directive} = require('../../index');
const {extractStyleDisplayFromDozProps} = require('../../helpers');
const queue = require('../../../utils/queue');
const delay = require('../../../utils/delay');

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
        const thereIsAnimateDirective = $target.__animationDirectiveValue;
        $target.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';
        //$target.__animationWasUsed =
        //console.dir($target);

        if (thereIsAnimateDirective && $target.__animationWasUsedByShowDirective) {
            //console.log($target.__animationIsRunning)
            if (!$target.__animationsList)
                $target.__animationsList = [];

            $target.__animationWasUsedByShowDirective = true;

            $target.__animationsList.push((resolve) => {
                //console.log('value', value)
                if (value) {
                    $target.style.display = $target.__showOriginDisplay;
                    $target.__animationShow(() => {
                        $target.style.display = $target.__showOriginDisplay;
                        resolve();
                    });
                } else {
                    $target.__animationHide(() => {
                        $target.style.display = 'none';
                        resolve();
                    });
                }
            });

            //console.log($target.__animationsList)

            if (thereIsAnimateDirective.queue) {
                if (!$target.__animationIsRunning) {
                    // please don't use it
                    queue($target.__animationsList.shift(), $target.__animationsList);
                }
            } else {
                new Promise($target.__animationsList.shift()).then();
            }

        } else {
            if (thereIsAnimateDirective)
                $target.__animationWasUsedByShowDirective = true;
            //delay(() => {
                $target.style.display = value === false ? 'none' : $target.__showOriginDisplay;
            //});
        }
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },

    // Per il momento gestisco con il virtual dom
    /*onComponentVNodeTick(instance, newNode, oldNode, directiveValue) {
        //console.log('callComponentVNodeTick', newNode.props)
        if (newNode.props['d-animate']) return;
        if (newNode.props.style) {
            if (!directiveValue) {
                newNode.props.style += '; display: none';
            }
        } else {
            newNode.props.style = directiveValue ? 'display: none' : '';
        }
    }*/

});