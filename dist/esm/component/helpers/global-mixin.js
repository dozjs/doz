import Component from "../Component.js";
import mixin from "../../utils/mixin.js";
function globalMixin(obj) {
    mixin(Component.prototype, obj);
}
export default globalMixin;
