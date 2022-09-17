function createStyleSoftEntrance() {
    if (!document.getElementById('style--soft-entrance--')) {
        const style = document.createElement('style');
        style.id = 'style--soft-entrance--';
        style.innerHTML = `[data-soft-entrance] {visibility: hidden!important;}`;
        document.head.appendChild(style);
    }
}
export default createStyleSoftEntrance;
