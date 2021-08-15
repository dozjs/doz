const composeStyleInner = require('../../utils/compose-style-inner');
const createStyle = require('../../utils/create-style');

function scopedInner(cssContent, uId, tag, scoped, cmp) {
    if (typeof cssContent !== 'string') return;
    // se il componente non ha alcun tag allora imposto il tag per il selettore css a vuoto
    // questo accade quando si usa Doz.mount il quale "monta" direttamente il componente senza il wrapper "dz-app"
    if (cmp && cmp.tag === undefined)
        tag = ''
    cssContent = composeStyleInner(cssContent, tag);
    return createStyle(cssContent, uId, tag, scoped, cmp);
}

module.exports = {
    scopedInner
};