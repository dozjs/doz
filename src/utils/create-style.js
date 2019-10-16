const tagList = require("./tags");

function createStyle(cssContent, uId, tag, scoped) {
    let result;
    const styleId = `${uId}--style`;
    const styleResetId = `${uId}--style-reset`;
    const styleExists = document.getElementById(styleId);

    if (styleExists) {
        result = styleExists.innerHTML = cssContent;
    } else {
        if (scoped) {
            let resetContent = `${tag}, ${tag} *,`;
            resetContent += tagList.map(t => `${tag} ${t}`).join(',');
            resetContent += ` {all: initial}`;
            const styleResetEl = document.createElement("style");
            styleResetEl.id = styleResetId;
            styleResetEl.innerHTML = resetContent;
            document.head.appendChild(styleResetEl);
        }

        const styleEl = document.createElement("style");
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        document.head.appendChild(styleEl);
    }

    return result;
}

module.exports = createStyle;
