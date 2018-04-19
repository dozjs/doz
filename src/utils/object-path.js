function getByPath(path, obj) {
    return path.split('.').reduce((res, prop) =>
            res
                ? res[prop]
                : undefined
        , obj);
}

module.exports = getByPath;