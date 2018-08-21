const {TAG} = require('../constants');
const tag = TAG.TEXT_NODE_PLACE;
const re = [
    new RegExp('<' + tag + '>', 'gi'),
    new RegExp('></' + tag + '>', 'gi'),
    new RegExp('="<' + tag + '>(.*?)</' + tag + '>', 'gi'),
    new RegExp('<(.*?\\s)<' + tag + '>(.*?)</' + tag + '>', 'gi'),
    new RegExp('(\\son.*)<' + tag + '>(.*?)</' + tag + '>(.*?")', 'gi'),
];

module.exports = function (strings, ...value) {
    let result = strings[0];
    for (let i = 0; i < value.length; ++i) {
        result += `<${tag}>${value[i]}</${tag}>${strings[i + 1]}`;
    }

    result = result.replace(/<te-xt></gi, '<');
    result = result.replace(/><\/te-xt>/gi, '>');
    result = result.replace(/="<te-xt>(.*?)<\/te-xt>"/gi, '="$1"');
    result = result.replace(/<(.*?\s)<te-xt>(.*?)<\/te-xt>/gi, '<$1 $2');
    result = result.replace(/(\son.*)<te-xt>(.*?)<\/te-xt>(.*?")/gi, '$1$2$3');
/*
    console.log(re)
    result = result.replace(re[0], '<');
    result = result.replace(re[1], '>');
    result = result.replace(re[2], '="$1"');
    result = result.replace(re[3], '<$1 $2');
    result = result.replace(re[4], '$1$2$3');*/
    //console.log(result);

    return result;
};