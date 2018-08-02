const composeStyle = require('../utils/compose-style');

function scoped(instance) {
    if (typeof instance.style !== 'object') return;

    const styleId = `${instance.tag}--style`;
    const styleExists = document.querySelector(`#${styleId}`);

    if (styleExists) {
        styleExists.innerHTML = composeStyle(instance.style, instance.tag);
    } else {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = composeStyle(instance.style, instance.tag);
        document.head.appendChild(styleEl);
    }
}

module.exports = {
    scoped
};