const {ATTR} = require('../constants');

function extract(props) {

    const dProps = {};

    if (props.hasOwnProperty(ATTR.ALIAS)) {
        dProps['alias'] = props[ATTR.ALIAS];
        delete  props[ATTR.ALIAS];
    }

    if (props.hasOwnProperty(ATTR.STORE)) {
        dProps['store'] = props[ATTR.STORE];
        delete  props[ATTR.STORE];
    }

    if (props.hasOwnProperty(ATTR.LISTENER)) {
        dProps['callback'] = props[ATTR.LISTENER];
        delete  props[ATTR.LISTENER];
    }

    if (props.hasOwnProperty(ATTR.CLASS)) {
        dProps['class'] = props[ATTR.CLASS];
        delete  props[ATTR.CLASS];
    }

    return dProps;
}

module.exports = {
    extract
};