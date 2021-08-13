import isJSON from "./is-json.js";
import isNumber from "./is-number.js";
import toJSON from "./to-json.js";
import toNumber from "./to-number.js";
import typesMap from "./types-map.js";
function castStringTo(obj) {
    //return obj;
    if (typeof obj !== 'string') {
        return obj;
    }
    if (typesMap.hasOwnProperty(obj)) {
        return typesMap[obj];
    }
    else if (isJSON(obj)) {
        return toJSON(obj);
    }
    else if (isNumber(obj)) {
        return toNumber(obj);
    }
    return obj;
}
export default castStringTo;
