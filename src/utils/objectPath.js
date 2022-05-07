function getByPath(path, obj) {
    return path.split('.').reduce((res, prop) =>
            res
                ? res[prop]
                : undefined
        , obj);
}

function getLast(path, obj) {
    if (path.indexOf('.') !== -1) {
        path = path.split('.');
        path.pop();
        path = path.join('.');
    }
    return getByPath(path, obj);
}

module.exports = getByPath;
module.exports.getLast = getLast;