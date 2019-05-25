const diff = require('fast-array-diff/dist/diff/patch');

module.exports = function (newChildren, oldChildren) {

    let oldArray = [];
    let newArray = [];

    oldChildren.forEach(item => {
        if (item.props && item.props['data-key'] !== undefined)
            oldArray.push(item.props['data-key']);
    });

    newChildren.forEach(item => {
        if (item.props && item.props['data-key'] !== undefined)
            newArray.push(item.props['data-key']);
    });

    return diff.getPatch(oldArray, newArray);
};