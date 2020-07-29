function deepCopy(obj) {
    // if not array or object or is null return self
    if (typeof obj !== 'object' || obj === null) return obj;
    let newObj, i;
    // handle case: array
    if (Array.isArray(obj)) {
        let l;
        newObj = [];
        for (i = 0, l = obj.length; i < l; i++)
            newObj[i] = deepCopy(obj[i]);
        return newObj;
    }
    // handle case: object
    newObj = {};
    for (i in obj)
        if (obj.hasOwnProperty(i)) {
            //if (obj[i] === undefined)
            //console.log(i, obj[i])
            newObj[i] = deepCopy(obj[i]);
        }
    return newObj;
}

module.exports = deepCopy;