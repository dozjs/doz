module.exports = {
    ROOT: '__DOZ_GLOBAL_COMPONENTS__',
    TAG: {
        ROOT: 'doz-root',
        VIEW: 'doz-view-component'
    },
    REGEX: {
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_BIND: /^d-bind$/,
        IS_REF: /^d-ref$/,
        IS_ALIAS: /^d:alias$/,
        IS_STORE: /^d:store$/,
        IS_COMPONENT_LISTENER: /^d:on-(\w+)$/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        GET_LISTENER: /^this.(.*)\((.*)\)/
    },
    ATTR: {
        // Attributes for HTMLElement
        BIND: 'd-bind',
        REF: 'd-ref',
        // Attribute for Components
        ALIAS: 'd:alias',
        STORE: 'd:store',
        LISTENER: 'd:on',
        CLASS: 'd:class',
        STYLE: 'd:style'
    }
};