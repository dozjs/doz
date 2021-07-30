import html from "./html.js";
function canDecode(str) {
    return /&\w+;/.test(str)
        ? html.decode(str)
        : str;
}
export default canDecode;
