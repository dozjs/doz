import { registerComponent } from "../collection.js";
import { REGEX } from "../constants.js";
function component(tag, cfg = {}) {
    if (typeof tag !== 'string') {
        throw new TypeError('Tag must be a string');
    }
    if (!REGEX.IS_CUSTOM_TAG.test(tag)) {
        throw new TypeError('Tag must contain a dash (-) like my-component');
    }
    const cmp = {
        tag,
        cfg
    };
    registerComponent(cmp);
}
export default component;
