export const COMPONENT_DYNAMIC_INSTANCE = 'componentDynamicInstance';
export const COMPONENT_INSTANCE = 'componentInstance';
export const COMPONENT_ROOT_INSTANCE = 'componentRootInstance';
export const PROPS_ATTRIBUTES = 'props';
export const ALREADY_WALKED = 'walked';
export const DEFAULT_SLOT_KEY = '__default__';
export const NS = {
    SVG: 'http://www.w3.org/2000/svg'
};
export const TAG = {
    ROOT: 'dz-root',
    EACH: 'dz-each-root',
    APP: 'dz-app',
    EMPTY: 'dz-empty',
    MOUNT: 'dz-mount',
    SLOT: 'dz-slot',
    SLOT_UPPERCASE: 'DZ-SLOT',
    SUFFIX_ROOT: '-root',
    TEXT_NODE_PLACE: 'dz-text-node',
    ITERATE_NODE_PLACE: 'dz-iterate-node',
};
export const REGEX = {
    IS_DIRECTIVE: /^d[-:][\w-]+$/,
    IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
    IS_CUSTOM_TAG_STRING: /<\w+-[\w-]+/,
    IS_LISTENER: /^on/,
    IS_ID_SELECTOR: /^#[\w-_:.]+$/,
    IS_PARENT_METHOD: /^parent.(.*)/,
    IS_STRING_QUOTED: /^"\w+"/,
    IS_SVG: /^svg$/,
    GET_LISTENER: /^this.(.*)\((.*)\)/,
    GET_LISTENER_SCOPE: /^scope.(.*)\((.*)\)/,
    IS_LISTENER_SCOPE: /(^|\()scope[.)]/g,
    TRIM_QUOTES: /^["'](.*)["']$/,
    THIS_TARGET: /\B\$this(?!\w)/g,
    HTML_MARKUP: /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>|<\/>/ig,
    HTML_ATTRIBUTE: /(^|\s)([\w-:]+)(\s*=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig,
    MATCH_NLS: /\n\s+/gm,
    REPLACE_QUOT: /"/g,
    REPLACE_D_DIRECTIVE: /^d[-:]/,
    EXTRACT_STYLE_DISPLAY_PROPERTY: /display(?:\s+)?:(?:\s+)?([\w-]+)/
};
export const ATTR = {
    // Attributes for both
    FORCE_UPDATE: 'forceupdate'
};
export default {
    COMPONENT_DYNAMIC_INSTANCE,
    COMPONENT_INSTANCE,
    COMPONENT_ROOT_INSTANCE,
    PROPS_ATTRIBUTES,
    ALREADY_WALKED,
    DEFAULT_SLOT_KEY,
    NS,
    TAG,
    REGEX,
    ATTR
};
