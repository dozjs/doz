const {REGEX, PROPS_ATTRIBUTES} = require('../constants.js');

function extractDirectivesFromProps(cmp) {
    //let canBeDeleteProps = true;
    let props;

    if (!Object.keys(cmp.props).length) {
        props = cmp._rawProps;
        //canBeDeleteProps = false;
    } else {
        props = cmp.props;
    }

    Object.keys(props).forEach(key => {
        if (isDirective(key)) {
            let keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            cmp._directiveProps[keyWithoutD] = props[key];
            /*if (canBeDeleteProps)
                delete props[key];*/
        }
    });

    return cmp._directiveProps;
}

function isDirective(name) {
    return REGEX.IS_DIRECTIVE.test(name);
}

function extractStyleDisplayFromDozProps($target) {
    if (!$target[PROPS_ATTRIBUTES] || !$target[PROPS_ATTRIBUTES].style) return null;

    let match = $target[PROPS_ATTRIBUTES].style.match(REGEX.EXTRACT_STYLE_DISPLAY_PROPERTY);

    if (match) {
        return match[1];
    }
    return null;
}

module.exports = {
    isDirective,
    extractDirectivesFromProps,
    extractStyleDisplayFromDozProps
};