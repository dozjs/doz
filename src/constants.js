module.exports = {
    ROOT: '__DOZ_GLOBAL_COMPONENTS__',
    TAG: {
        ROOT: 'doz-root',
        VIEW: 'doz-view-component'
    },
    REGEX: {
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_BIND: /^d-bind$/,
        IS_ALIAS: /^d-alias$/,
        IS_REF: /^d-ref$/,
        IS_LISTENER: /^on/,
        IS_ID_SELECTOR: /^#[\w-_:.]+$/,
        GET_LISTENER: /^this.(.*)\((.*)\)/
    },
    ATTR: {
        BIND: 'd-bind',
        ALIAS: 'd-alias',
        REF: 'd-ref'
    }
};