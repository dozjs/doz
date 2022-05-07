import mixin from "../../utils/mixin.js";
function localMixin(instance) {
    mixin(instance, instance.mixin);
    instance.mixin = [];
}
export default localMixin;
