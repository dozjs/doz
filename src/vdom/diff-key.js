const patch = require('fast-array-diff/dist/diff/patch');

module.exports = function (newChildren, oldChildren) {

    if (newChildren.length === oldChildren.length) return [];

    let oldArray = [];
    let newArray = [];
    let diffIndex = [];

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

    oldArray.forEach((x, i) => {
        if (!newArray.includes(x)) {
            if (oldChildren[i].props && oldChildren[i].props['data-key'] === undefined) return;
            diffIndex.push(i)
        }
    });

    //console.log(newArray, oldArray)

    if (!diffIndex.length) {
        for (let i = 0; i < oldChildren.length; i++) {
            if (i + 1 >= oldChildren.length) break;
            if (oldChildren[i].props &&  oldChildren[i + 1].props && oldChildren[i].props['data-key'] === oldChildren[i + 1].props['data-key']) {
                diffIndex.push(i);
                break;
            }
        }
    }

    return diffIndex;
};