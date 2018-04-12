module.exports = {
    ROOT: '__DOZ_GLOBAL_COMPONENTS__',
    REGEX: {
        IS_CUSTOM_TAG: /^\w+-[\w-]+$/,
        IS_BIND: /^d-bind$/,
        IS_ALIAS: /^d-alias$/,
        IS_REF: /^d-ref$/,
        IS_LISTENER: /^on/,
        GET_LISTENER: /^this.(.*)\((.*)\)/
    },
    ATTR: {
        BIND: 'd-bind',
        ALIAS: 'd-alias',
        REF: 'd-ref'
    }
};