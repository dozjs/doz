module.exports = {
    ROOT: '__DOZ__',
    SIGN: '__DOZ_SIGN__',
    INSTANCE: '__DOZ_INSTANCE__',
    EVENTS: [
        'show',
        'hide',
        'beforeContentChange',
        'contentChange',
        'state',
        'beforeState'
    ],
    PARSER: {
        REGEX: {
            TAG: /^\w+-[\w-]+$/,
            ATTR: /{{([\w.]+)}}/,
            TEXT: /(?!<.){{([\w.]+)}}(?!.>)/g,
            LISTENER: /<.+ on-(.*)="?(.*)"?.*>/g
        },
        TAG: {
            TEXT: 'doz-text-node'
        }
    },
    ATTR: {
        WIDGET: 'doz-medom-widget'
    }
};