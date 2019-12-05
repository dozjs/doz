function wait(what, callback, maxCount = 1000) {
    let rid;
    let count = 0;
    let check = function() {
        if (count > maxCount) {
            console.log('max cicles exceeded');
            return;
        }
        if (!what()) {
            count ++;
            rid = requestAnimationFrame(check);
        } else {
            if (rid) {
                cancelAnimationFrame(rid);
                rid = null;
            }
            callback();
        }
    };
    rid = requestAnimationFrame(check);
}

module.exports = wait;