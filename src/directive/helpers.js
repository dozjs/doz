const {REGEX} = require('../constants.js');

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

module.exports = {
    isDirective,
    extractDirectivesFromProps
};