//const raf = window.requestAnimationFrame || window.setTimeout;
const raf = function (cb) {
    cb();
};

/*function delay(cb) {
        return raf(cb);
}*/

module.exports = raf;