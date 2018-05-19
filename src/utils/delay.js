function delay(cb) {
    if (window.requestAnimationFrame !== undefined)
        return window.requestAnimationFrame(cb);
    else
        return window.setTimeout(cb);
}

module.exports = delay;