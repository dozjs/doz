function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = cloneObject;