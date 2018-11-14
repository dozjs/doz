module.exports = {
    INSTANCE: '__DOZ_INSTANCE__',
    DIR_IS: '__DOZ_D_IS__',
    CMP_INSTANCE: '__DOZ_CMP_INSTANCE__',
    NS: {
        SVG: 'http://www.w3.org/2000/svg'
    },
    TAG: {
        ROOT: 'dz-root',
        EACH: 'dz-each-root',
        APP: 'dz-app',
        EMPTY: 'dz-empty',
        MOUNT: 'dz-mount',
        SUFFIX_ROOT: '-root',
        TEXT_NODE_PLACE: 'dz-text-node'
    },
    REGEX: {
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
        IS_BIND: /^d-bind$/,
        IS_REF: /^d-ref$/,
        IS_ALIAS: /^d:alias$/,
        IS_STORE: /^d:store$/,
        IS_COMPONENT_LISTENER: /^d:on-(\w+)$/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        IS_PARENT_METHOD: /^parent.(.*)/,
        IS_STRING_QUOTED: /^"\w+"/,
        IS_SVG: /^svg$/,
        GET_LISTENER: /^this.(.*)\((.*)\)/,
        TRIM_QUOTES: /^["'](.*)["']$/,
        THIS_TARGET: /\B\$this(?!\w)/g,
        HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/ig,
        HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
        CSS_SELECTOR: /([-_\.#:\w]+(?:\s+)?[{,])/g
    },
    ATTR: {
        // Attributes for HTMLElement
        BIND: 'd-bind',
        REF: 'd-ref',
        IS: 'd-is',
        // Attributes for Components
        ALIAS: 'd:alias',
        STORE: 'd:store',
        LISTENER: 'd:on',
        ID: 'd:id',
        FORCE_UPDATE: 'forceupdate'
    }
};