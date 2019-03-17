const {ATTR, DPROPS} = require('../constants');

function extract(props) {

    const dProps = {};

    if (props[ATTR.ALIAS] !== undefined) {
        dProps[DPROPS.ALIAS] = props[ATTR.ALIAS];
        delete  props[ATTR.ALIAS];
    }

    if (props[ATTR.STORE] !== undefined) {
        dProps[DPROPS.STORE] = props[ATTR.STORE];
        delete  props[ATTR.STORE];
    }

    if (props[ATTR.LISTENER] !== undefined) {
        dProps[DPROPS.CALLBACK] = props[ATTR.LISTENER];
        delete  props[ATTR.LISTENER];
    }

    if (props[ATTR.ID] !== undefined) {
        dProps[DPROPS.ID] = props[ATTR.ID];
        delete  props[ATTR.ID];
    }

    if (props[ATTR.ON_BEFORE_CREATE] !== undefined) {
        dProps[DPROPS.ON_BEFORE_CREATE] = props[ATTR.ON_BEFORE_CREATE];
        delete  props[ATTR.ON_BEFORE_CREATE];
    }

    if (props[ATTR.ON_CREATE] !== undefined) {
        dProps[DPROPS.ON_CREATE] = props[ATTR.ON_CREATE];
        delete  props[ATTR.ON_CREATE];
    }

    if (props[ATTR.ON_CONFIG_CREATE] !== undefined) {
        dProps[DPROPS.ON_CONFIG_CREATE] = props[ATTR.ON_CONFIG_CREATE];
        delete  props[ATTR.ON_CONFIG_CREATE];
    }

    if (props[ATTR.ON_BEFORE_MOUNT] !== undefined) {
        dProps[DPROPS.ON_BEFORE_MOUNT] = props[ATTR.ON_BEFORE_MOUNT];
        delete  props[ATTR.ON_BEFORE_MOUNT];
    }

    if (props[ATTR.ON_MOUNT] !== undefined) {
        dProps[DPROPS.ON_MOUNT] = props[ATTR.ON_MOUNT];
        delete  props[ATTR.ON_MOUNT];
    }

    if (props[ATTR.ON_MOUNT_ASYNC] !== undefined) {
        dProps[DPROPS.ON_MOUNT_ASYNC] = props[ATTR.ON_MOUNT_ASYNC];
        delete  props[ATTR.ON_MOUNT_ASYNC];
    }

    if (props[ATTR.ON_BEFORE_UPDATE] !== undefined) {
        dProps[DPROPS.ON_BEFORE_UPDATE] = props[ATTR.ON_BEFORE_UPDATE];
        delete  props[ATTR.ON_BEFORE_UPDATE];
    }

    if (props[ATTR.ON_UPDATE] !== undefined) {
        dProps[DPROPS.ON_UPDATE] = props[ATTR.ON_UPDATE];
        delete  props[ATTR.ON_UPDATE];
    }

    if (props[ATTR.ON_AFTER_RENDER] !== undefined) {
        dProps[DPROPS.ON_AFTER_RENDER] = props[ATTR.ON_AFTER_RENDER];
        delete  props[ATTR.ON_AFTER_RENDER];
    }

    if (props[ATTR.ON_BEFORE_UNMOUNT] !== undefined) {
        dProps[DPROPS.ON_BEFORE_UNMOUNT] = props[ATTR.ON_BEFORE_UNMOUNT];
        delete  props[ATTR.ON_BEFORE_UNMOUNT];
    }

    if (props[ATTR.ON_UNMOUNT] !== undefined) {
        dProps[DPROPS.ON_UNMOUNT] = props[ATTR.ON_UNMOUNT];
        delete  props[ATTR.ON_UNMOUNT];
    }

    if (props[ATTR.ON_BEFORE_DESTROY] !== undefined) {
        dProps[DPROPS.ON_BEFORE_DESTROY] = props[ATTR.ON_BEFORE_DESTROY];
        delete  props[ATTR.ON_BEFORE_DESTROY];
    }

    if (props[ATTR.ON_DESTROY] !== undefined) {
        dProps[DPROPS.ON_DESTROY] = props[ATTR.ON_DESTROY];
        delete  props[ATTR.ON_DESTROY];
    }

    if (props[ATTR.ON_LOAD_PROPS] !== undefined) {
        dProps[DPROPS.ON_LOAD_PROPS] = props[ATTR.ON_LOAD_PROPS];
        delete  props[ATTR.ON_LOAD_PROPS];
    }

    return dProps;
}

module.exports = {
    extract
};