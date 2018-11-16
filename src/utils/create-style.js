function createStyle(cssContent, tag) {
    let result;
    const styleId = `${tag}--style`;
    const styleExists = document.querySelector(`#${styleId}`);

    if (styleExists) {
        result = styleExists.innerHTML = cssContent;
    } else {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        document.head.appendChild(styleEl);
    }

    return result;
}

module.exports = createStyle;