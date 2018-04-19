const {ATTR} = require('../constants');

function extract(props) {

    const dProps = {};

    if (props[ATTR.ALIAS] !== undefined) {
        dProps['alias'] = props[ATTR.ALIAS];
        delete  props[ATTR.ALIAS];
    }

    if (props[ATTR.STORE] !== undefined) {
        dProps['store'] = props[ATTR.STORE];
        delete  props[ATTR.STORE];
    }

    if (props[ATTR.LISTENER] !== undefined) {
        dProps['callback'] = props[ATTR.LISTENER];
        delete  props[ATTR.LISTENER];
    }

    if (props[ATTR.CLASS] !== undefined) {
        dProps['class'] = props[ATTR.CLASS];
        delete  props[ATTR.CLASS];
    }

    if (props[ATTR.ID] !== undefined) {
        dProps['id'] = props[ATTR.ID];
        delete  props[ATTR.ID];
    }

    return dProps;
}

module.exports = {
    extract
};