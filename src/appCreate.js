import Doz from "./Doz.js";
function appCreate(root, component, options) {
    let cfg = Object.assign({
        root,
        mainComponent: component,
        byAppCreate: true
    }, options);
    return new Doz(cfg);
}
export default appCreate;
