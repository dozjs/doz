module.exports = {
    COMPONENT_DYNAMIC_INSTANCE: 'componentDynamicInstance',
    COMPONENT_INSTANCE: 'componentInstance',
    COMPONENT_ROOT_INSTANCE: 'componentRootInstance',
    PROPS_ATTRIBUTES: 'props',
    ALREADY_WALKED: 'walked',
    DEFAULT_SLOT_KEY: '__default__',
    NS: {
        SVG: 'http://www.w3.org/2000/svg'
    },
    TAG: {
        ROOT: 'dz-root',
        EACH: 'dz-each-root', //not in use
        APP: 'dz-app',
        EMPTY: 'dz-empty',
        MOUNT: 'dz-mount',
        SLOT: 'dz-slot',
        SLOT_UPPERCASE: 'DZ-SLOT',
        SUFFIX_ROOT: '-root',
        TEXT_NODE_PLACE: 'dz-text-node',
        ITERATE_NODE_PLACE: 'dz-iterate-node',
    },
    REGEX: {
        IS_DIRECTIVE: /^d[-:][\w-]+$/,
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        IS_PARENT_METHOD: /^parent.(.*)/,
        IS_STRING_QUOTED: /^"\w+"/,
        IS_SVG: /^svg$/,
        IS_CLASS: /^(class\s|function\s+_class|function.*[\s\S]+_classCallCheck\(this, .*\))|(throw new TypeError\("Cannot call a class)|(function.*\.__proto__\|\|Object\.getPrototypeOf\(.*?\))|(\)\.call\(this,)|(\).apply\(this,arg)|(for\(var.+=arguments.length)|(\.apply\(this,arguments\))|\.call\(this,?.*?\)/i,
        GET_LISTENER: /^this.(.*)\((.*)\)/,
        GET_LISTENER_SCOPE: /^scope.(.*)\((.*)\)/,
        IS_LISTENER_SCOPE: /(^|\()scope[.)]/g,
        TRIM_QUOTES: /^["'](.*)["']$/,
        THIS_TARGET: /\B\$this(?!\w)/g,
        //HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/ig,
        HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>|<\/>/ig,
        HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
        MATCH_NLS: /\n\s+/gm,
        REPLACE_QUOT: /"/g,
        REPLACE_D_DIRECTIVE: /^d[-:]/,
        EXTRACT_STYLE_DISPLAY_PROPERTY: /display(?:\s+)?:(?:\s+)?([\w-]+)/
    },
    ATTR: {
        // Attributes for both
        FORCE_UPDATE: 'forceupdate'
    }
};
