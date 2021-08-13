function removeAllAttributes(el, exclude = []) {
    let attributeName;
    for (let i = el.attributes.length - 1; i >= 0; i--) {
        attributeName = el.attributes[i].name;
        // exclude anyway data attributes
        if (exclude.includes(attributeName) || attributeName.split('-')[0] === 'data')
            continue;
        el.removeAttribute(attributeName);
    }
}
export default removeAllAttributes;
