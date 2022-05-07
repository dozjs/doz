import composeStyleInner from "../../utils/composeStyleInner.js";
import createStyle from "../../utils/createStyle.js";
function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string')
        return;
    cssContent = composeStyleInner(cssContent, tag, cmp);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}
export { scopedInner };
export default {
    scopedInner
};
