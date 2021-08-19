/*
// Add tag prefix to animation name inside keyframe
(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)

// Add tag prefix to animation
((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)
 */
//const mapper = require('../vdom/mapper');
function composeStyleInner(cssContent, tag, cmp) {
    if (typeof cssContent !== 'string')
        return;
    //cssContent = mapper.getAll(cssContent);
    let sanitizeTagForAnimation = tag.replace(/[^\w]/g, '');
    if (/:root/.test(cssContent)) {
        console.warn('[DEPRECATION] the :root pseudo selector is deprecated, use :component or :wrapper instead');
    }
    // se il componente non ha alcun tag allora imposto il tag per il selettore css a vuoto
    // questo accade quando si usa Doz.mount il quale "monta" direttamente il componente senza il wrapper "dz-app"
    /*if (cmp && cmp.tag === undefined) {
        tag = '';

        if (cmp.app.isWebComponent && cmp.app.byAppCreate) {
            cssContent = cssContent
                .replace(/:(component|wrapper|root)/g, ':host')
        }
    }*/
    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/^(\s+)?:(component|wrapper|root)(\s+)?{/gm, tag + ' {')
        .replace(/:(component|wrapper|root)/g, '')
        .replace(/(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        .replace(/((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
        .replace(/[^\s].*{/gm, match => {
        if (/^(@|:host|(from|to|\d+%)[^-_])/.test(match))
            return match;
        let part = match.split(',');
        const sameTag = new RegExp(`^${tag.replace(/[[\]]/g, '\\$&')}(\\s+)?{`);
        for (let i = 0; i < part.length; i++) {
            part[i] = part[i].trim();
            if (sameTag.test(part[i]))
                continue;
            if (/^:global/.test(part[i]))
                part[i] = part[i].replace(':global', '');
            else
                part[i] = `${tag} ${part[i]}`;
        }
        match = part.join(',');
        return match;
    });
    cssContent = cssContent
        .replace(/\s{2,}/g, ' ')
        .replace(/{ /g, '{')
        .replace(/ }/g, '}')
        .replace(/\s:/g, ':') //remove space before pseudo classes
        .replace(/\n/g, '')
        .trim();
    return cssContent;
}
export default composeStyleInner;
