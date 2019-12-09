const {directive} = require('../index');

function queue($target, p) {
    if (!p) return;
    new Promise(p).then(() => queue($target, $target.__animationsList.shift()));
}

directive('show', {

    setVisible($target, value) {
        const isAnimated = $target.__animationDirectiveValue;
        $target.__showOriginDisplay = $target.__showOriginDisplay || '';
        if ($target.__showOriginDisplay === 'none') $target.__showOriginDisplay = '';
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
        let computedStyle = window.getComputedStyle($target);
        this.setVisible($target, directiveValue);
        setTimeout(() => {
            $target.__showOriginDisplay = computedStyle.display;
        });
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        this.setVisible($target, directiveValue);
    }

});