import composeStyleInner from "../../utils/compose-style-inner.js";
import createStyle from "../../utils/create-style.js";
function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string')
        return;
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}
export { scopedInner };
export default {
    scopedInner
};
