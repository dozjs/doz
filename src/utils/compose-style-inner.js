function composeStyleInner(cssContent, tag) {
    if (typeof cssContent !== 'string') return;
    cssContent = cssContent
        .replace(/{/g, '{\n')
        .replace(/}/g, '}\n')
        .replace(/:root/g, '')
        .replace(/[^\s].*{/gm, match => {

            if (/^(@|(from|to)[^-_])/.test(match))
                return match;

            let part = match.split(',');

            for (let i = 0; i < part.length; i++) {
                if (part[i] === tag) continue;
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