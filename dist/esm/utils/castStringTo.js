import isJSON from "./isJson.js";
import isNumber from "./isNumber.js";
import toJSON from "./toJson.js";
import toNumber from "./toNumber.js";
import typesMap from "./typesMap.js";
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
