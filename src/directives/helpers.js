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

function isDirective(aName) {
    //return REGEX.IS_DIRECTIVE.test(name);
    return aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':');
}

function extractStyleDisplayFromDozProps($target) {
    if (!$target._dozAttach[PROPS_ATTRIBUTES] || !$target._dozAttach[PROPS_ATTRIBUTES].style) return null;

    let match = $target._dozAttach[PROPS_ATTRIBUTES].style.match(REGEX.EXTRACT_STYLE_DISPLAY_PROPERTY);

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