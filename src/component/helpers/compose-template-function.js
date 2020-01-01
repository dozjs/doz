const dashToCamel = require('../../utils/dash-to-camel');
const {isDirective} = require('../../directives/helpers');

function composeTemplateFunction(cmp, contentStr) {

    console.log('BEFORE')
    console.log(contentStr)

    contentStr = contentStr
        .replace(/{{/gm, '${')
        .replace(/}}/gm, '}')
        .replace(/ =&gt; /gm, ' => h`')
        .replace(/\)/gm, '`)')
        .replace(/#/gm, 'this.')
    ;

    console.log('AFTER')
    console.log(contentStr)

    let argsName = ['h'];
    let argsValue = [cmp.h];

    let propsKeys = Object.keys(cmp.props);
    for (let i = 0; i < propsKeys.length; i++) {
        if (isDirective(propsKeys[i])) continue;
        argsName.push(dashToCamel(propsKeys[i]));
        argsValue.push(cmp.props[propsKeys[i]]);
    }
    /*
    if (/<div>hello/.test(contentStr)) {
        console.log('argsName', argsName)
        console.log('argsValue', argsValue)
        console.log('contentStr', 'return h`' + contentStr + '`');
        console.log('cmp.tag', cmp.tag);
        console.log('-------------------');
    }
    */
    return new Function(argsName, 'return h`' + contentStr + '`').apply(cmp, argsValue);
}

module.exports = composeTemplateFunction;