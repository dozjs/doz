function animateHelper($target, animationName, opts, callback) {

    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    } else if (!opts) {
        opts = {};
    }

    if($target._dozAttach.__animationIsRunning) {
        $target.classList.remove($target._dozAttach.__lastAnimationName);
        $target._dozAttach.__animationIsRunning = false;
        $target._dozAttach.__lockedForAnimation = false;
        $target.removeEventListener('animationend', $target._dozAttach.__handleAnimationEnd);
    }

    $target._dozAttach.__animationIsRunning = true;

    let computedStyle = window.getComputedStyle($target);
    opts.classLib = opts.classLib || 'animated'; //Default animate.css

    // Now supports IE11
    $target.classList.add(opts.classLib);
    $target.classList.add(animationName);
    $target._dozAttach.__lastAnimationName = animationName;

    $target._dozAttach.__animationOriginDisplay = computedStyle.display;

    if ($target._dozAttach.__animationOriginDisplay === 'inline') {
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
        //console.log('call animation end')
        $target.classList.remove(opts.classLib);
        $target.classList.remove(animationName);

        $target._dozAttach.__animationIsRunning = false;
        $target._dozAttach.__lockedForAnimation = false;

        //$target.style.display = $target._dozAttach.__animationOriginDisplay;
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
        if (typeof callback === 'function') callback();
        if (typeof opts.cb === 'function') opts.cb();
    }

    //console.log('set animation end to', $target);
    //console.log('body contains', document.body.contains($target));
    $target.addEventListener('animationend', handleAnimationEnd);
    $target._dozAttach.__handleAnimationEnd = handleAnimationEnd;


}

module.exports = animateHelper;
