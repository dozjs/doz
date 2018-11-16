function composeStyleInner(cssContent, tag, tagByData) {
    if (typeof cssContent !== 'string') return;

    tag = tagByData || tag;

    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/^(\s+)?:root(\s+)?{/gm, tag + ' {')
        .replace(/:root/g, '')
        .replace(/[^\s].*{/gm, match => {

            if (/^(@|(from|to)[^-_])/.test(match))
                return match;

            let part = match.split(',');
            const sameTag = new RegExp(`^${tag.replace(/[[\]]/g, '\\$&')}(\\s+)?{`);

            for (let i = 0; i < part.length; i++) {
                if (sameTag.test(part[i].trim())) continue;

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