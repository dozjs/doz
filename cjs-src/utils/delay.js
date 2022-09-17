let d = window.setTimeout.bind(window);
if (window.requestAnimationFrame) {
    d = window.requestAnimationFrame.bind(window);
}
module.exports = d;