window.requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

function wait(what, callback, maxCount = 1000, exceededCallback) {
    let rid;
    let count = 0;
    let check = function() {
        if (count >= maxCount) {
            //console.warn('wait, max cicles exceeded ' + maxCount + ', ' + message);
            if (typeof exceededCallback === 'function')
                exceededCallback();
            return;
        }
        if (!what()) {
            count ++;
            rid = window.requestAnimationFrame(check);
        } else {
            if (rid) {
                window.cancelAnimationFrame(rid);
                rid = null;
            }
            callback();
        }
    };
    rid = window.requestAnimationFrame(check);
}

module.exports = wait;