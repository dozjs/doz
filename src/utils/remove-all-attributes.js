function removeAllAttributes(el, exclude = []) {
    let attributeName;
    for (let i = el.attributes.length - 1; i >= 0; i--){
        attributeName = el.attributes[i].name;
        if (exclude.includes(attributeName)) continue;
        el.removeAttribute(attributeName);
    }
}

module.exports = removeAllAttributes;