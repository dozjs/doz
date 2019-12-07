function animateHelper($target, animationName, opts, callback) {

    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    } else if (!opts) {
        opts = {};
    }

    $target.__animationIsRunning = true;

    let computedStyle = window.getComputedStyle($target);
    // Now supports IE11
    $target.classList.add('animated');
    $target.classList.add(animationName);

    $target.__animationOriginDisplay = $target.style.display;

    if (computedStyle.display === 'inline') {
        $target.style.display = 'inline-block';
    }

    if (opts.delay) {
        $target.style.animationDelay = opts.delay;
        $target.style.webkitAnimationDelay = opts.delay;
        $target.style.mozAnimationDelay = opts.delay;
    }

    if (opts.duration) {
        $target.style.animationDuration = opts.duration;
        $target.style.webkitAnimationDuration = opts.duration;
        $target.style.mozAnimationDuration = opts.duration;
    }

    if (opts.iterationCount) {
        $target.style.animationIterationCount = opts.iterationCount;
        $target.style.webkitAnimationIterationCount = opts.iterationCount;
        $target.style.mozAnimationIterationCount = opts.iterationCount;
    }

    function handleAnimationEnd() {
        $target.classList.remove('animated');
        $target.classList.remove(animationName);

        $target.__animationIsRunning = false;
        $target.__animationEnterIsComplete = true;
        $target.__lockedForAnimation = false;

        $target.style.display = computedStyle.display;
        $target.style.animationDelay = '';
        $target.style.webkitAnimationDelay = '';
        $target.style.mozAnimationDelay = '';
        $target.style.animationDuration = '';
        $target.style.webkitAnimationDuration = '';
        $target.style.mozAnimationDuration = '';
        $target.style.animationIterationCount = '';
        $target.style.webkitAnimationIterationCount = '';
        $target.style.mozAnimationIterationCount = '';

        $target.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') callback()
    }

    $target.addEventListener('animationend', handleAnimationEnd);
}

module.exports = animateHelper;