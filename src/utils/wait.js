window.requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

function wait(what, callback, maxCount = 1000, exceededCallback) {
    let rid;
    let count = 0;
    let cancelWait = function() {
        window.cancelAnimationFrame(rid);
        rid = null;
    }
    let check = function() {
        if (count >= maxCount) {
            console.warn('wait, max cycles exceeded ' + maxCount);
            if (typeof exceededCallback === 'function')
                exceededCallback();
            return;
        }
        if (!what(cancelWait)) {
            count ++;
            rid = window.requestAnimationFrame(check);
        } else {
            if (rid) {
                cancelWait();
                /*window.cancelAnimationFrame(rid);
                rid = null;*/
            }
            callback();
        }
    };
    rid = window.requestAnimationFrame(check);
}

module.exports = wait;