const {directive} = require('../index');
const {extractStyleDisplayFromDozProps} = require('../helpers');

function queue($target, p) {
    if (!p) return;
    new Promise(p).then(() => queue($target, $target.__animationsList.shift()));
}

directive('show', {

    setVisible($target, value) {
        const isAnimated = $target.__animationDirectiveValue;
        $target.__showOriginDisplay = extractStyleDisplayFromDozProps($target) || '';

        if (isAnimated) {
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

            if (!$target.__animationIsRunning)
                queue($target, $target.__animationsList.shift());

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