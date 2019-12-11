const {directive} = require('../../index');
const {extractStyleDisplayFromDozProps} = require('../../helpers');
const queue = require('../../../utils/queue');

directive('show', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            show: {
                value: () => {},
                writable: true,
                enumerable: true
            },
            hide: {
                value: () => {},
                writable: true,
                enumerable: true
            }
        });
    },

    setVisible($target, value) {
        const thereIsAnimateDirective = $target.__animationDirectiveValue;
        $target.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';

        if (thereIsAnimateDirective) {
            if (!$target.__animationsList)
                $target.__animationsList = [];

            $target.__animationsList.push((resolve) => {
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

            if (!$target.__animationIsRunning) {
                queue($target.__animationsList.shift(), $target.__animationsList);
            }

        } else {
            $target.style.display = value === false ? 'none' : $target.__showOriginDisplay;
        }
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    }

});