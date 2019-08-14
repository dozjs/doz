/*
// Add tag prefix to animation name inside keyframe
(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)

// Add tag prefix to animation
((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)
 */

function composeStyleInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;

    //tag = tagByData || tag;

    let sanitizeTagForAnimation = tag.replace(/[^\w]/g, '');

    if (/:root/.test(cssContent)) {
        console.warn('[DEPRECATION] the :root pseudo selector is deprecated, use :wrapper instead');
    }

    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/^(\s+)?(:wrapper|:root)(\s+)?{/gm, tag + ' {')
        .replace(/(:wrapper|:root)/g, '')
        .replace(/(@(?:[\w-]+-)?keyframes\s+)([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        .replace(/((?:[\w-]+-)?animation(?:-name)?(?:\s+)?:(?:\s+))([\w-_]+)/g, `$1 ${sanitizeTagForAnimation}-$2`)
        .replace(/[^\s].*{/gm, match => {

            if (/^(@|(from|to|\d+%)[^-_])/.test(match))
                return match;

            let part = match.split(',');
            const sameTag = new RegExp(`^${tag.replace(/[[\]]/g, '\\$&')}(\\s+)?{`);

            for (let i = 0; i < part.length; i++) {
                part[i] = part[i].trim();
                if (sameTag.test(part[i])) continue;

                if (/^:global/.test(part[i]))
                    part[i] = part[i].replace(':global', '');
                else
                    part[i] = `${tag} ${part[i]}`;
            }
            match = part.join(',');
            return match

        });

    cssContent = cssContent
        .replace(/\s{2,}/g, ' ')
        .replace(/{ /g, '{')
        .replace(/ }/g, '}')
        .replace(/\n/g, '')
        .trim();

    return cssContent;
}

module.exports = composeStyleInner;