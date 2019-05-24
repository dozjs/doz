const diff = require('fast-array-diff/dist/diff/patch');

module.exports = function (newChildren, oldChildren) {

    //if (newChildren.length === oldChildren.length) return [];

    let oldArray = [];
    let newArray = [];

    oldChildren.forEach(item => {
        if (item.props && item.props['data-key'] !== undefined)
            //if (!oldArray.includes(item.props['data-key']))
                oldArray.push(item.props['data-key']);
        else
            oldArray.push(null)
    });

    newChildren.forEach(item => {
        if (item.props && item.props['data-key'] !== undefined)
            //if (!newArray.includes(item.props['data-key']))
                newArray.push(item.props['data-key']);
        else
            newArray.push(null)
    });

    return diff.getPatch(oldArray, newArray);
};