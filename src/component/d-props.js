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

    return dProps;
}

module.exports = {
    extract
};