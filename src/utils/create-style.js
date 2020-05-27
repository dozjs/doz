const tagList = require('./tags');
const {TAG} = require('../constants');

function createStyle(cssContent, uId, tag, scoped, cmp) {
    let result;
    const styleId = `${uId}--style`;
    const styleResetId = `${uId}--style-reset`;
    //const styleExists = document.getElementById(styleId);

    let styleExists;

    if (cmp && cmp.app.isDozWebComponent) {
        styleExists = cmp.app._root.getElementById(styleId);
    } else {
        styleExists = document.getElementById(styleId);
    }

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
            if (cmp && cmp.app.isDozWebComponent) {
                let tagApp = cmp.app._root.querySelector(TAG.APP);
                cmp.app._root.insertBefore(styleResetEl, tagApp);
            } else {
                document.head.appendChild(styleResetEl);
            }
        }

        const styleEl = document.createElement("style");
        styleEl.id = styleId;
        result = styleEl.innerHTML = cssContent;
        if (cmp && cmp.app.isDozWebComponent) {
            let tagApp = cmp.app._root.querySelector(TAG.APP);
            cmp.app._root.insertBefore(styleEl, tagApp);
        } else {
            document.head.appendChild(styleEl);
        }
    }

    return result;
}

module.exports = createStyle;
