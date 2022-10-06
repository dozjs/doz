import { REGEX, PROPS_ATTRIBUTES } from "../constants.js";
import isEmptyObject from "../utils/isEmptyObject.js";
function extractDirectivesFromProps(cmp) {
    let props;

    if (isEmptyObject(cmp.props)) {
        props = cmp._rawProps;
    } else {
        props = cmp.props;
    }
    //console.log(cmp.uId, props)
    //if (!isEmptyObject(cmp.props))
    if (!cmp._directiveProps) cmp._directiveProps = {};
    for (let key in props) {
        if (isDirective(key)) {
            let keyWithoutD = key.substring(2);
            console.log(cmp.uId, keyWithoutD, props[key])
            cmp._directiveProps[keyWithoutD] = props[key];
        }
    }/**/
    /*Object.keys(props).forEach(key => {
        if (isDirective(key)) {
            let keyWithoutD = key.replace(REGEX.REPLACE_D_DIRECTIVE, '');
            cmp._directiveProps[keyWithoutD] = props[key];
        }
    });*/
    //cmp._directivesExtracted = true;
    //console.log(cmp._directiveProps)
    return cmp._directiveProps;
}
function isDirective(aName) {
    //return REGEX.IS_DIRECTIVE.test(name);
    return aName[0] === 'd' && (aName[1] === '-' || aName[1] === ':');
}
function extractStyleDisplayFromDozProps($target) {
    if (!$target._dozAttach[PROPS_ATTRIBUTES] || !$target._dozAttach[PROPS_ATTRIBUTES].style)
        return null;
    let match = $target._dozAttach[PROPS_ATTRIBUTES].style.match(REGEX.EXTRACT_STYLE_DISPLAY_PROPERTY);
    if (match) {
        return match[1];
    }
    return null;
}
function extractDirectiveNameAndKeyValues(attributeName) {
    attributeName = attributeName.replace(REGEX.REPLACE_D_DIRECTIVE, '');
    let directiveName = attributeName;
    let keyArgumentsValues = [];
    if (directiveName.indexOf('-') !== -1) {
        keyArgumentsValues = directiveName.split('-');
        directiveName = keyArgumentsValues[0];
        keyArgumentsValues.shift();
    }
    return [directiveName, keyArgumentsValues];
}
export { isDirective };
export { extractDirectivesFromProps };
export { extractStyleDisplayFromDozProps };
export { extractDirectiveNameAndKeyValues };
export default {
    isDirective,
    extractDirectivesFromProps,
    extractStyleDisplayFromDozProps,
    extractDirectiveNameAndKeyValues
};
