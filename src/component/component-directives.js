const {ATTR, DPROPS} = require('../constants');

/**
 * Extract directives from props
 * @param props
 */
function extract(props) {

    const directives = {};

    if (props[ATTR.ALIAS] !== undefined) {
        directives[DPROPS.ALIAS] = props[ATTR.ALIAS];
        delete  props[ATTR.ALIAS];
    }

    if (props[ATTR.STORE] !== undefined) {
        directives[DPROPS.STORE] = props[ATTR.STORE];
        delete  props[ATTR.STORE];
    }

    if (props[ATTR.LISTENER] !== undefined) {
        directives[DPROPS.CALLBACK] = props[ATTR.LISTENER];
        delete  props[ATTR.LISTENER];
    }

    if (props[ATTR.ID] !== undefined) {
        directives[DPROPS.ID] = props[ATTR.ID];
        delete  props[ATTR.ID];
    }

    if (props[ATTR.ON_BEFORE_CREATE] !== undefined) {
        directives[DPROPS.ON_BEFORE_CREATE] = props[ATTR.ON_BEFORE_CREATE];
        delete  props[ATTR.ON_BEFORE_CREATE];
    }

    if (props[ATTR.ON_CREATE] !== undefined) {
        directives[DPROPS.ON_CREATE] = props[ATTR.ON_CREATE];
        delete  props[ATTR.ON_CREATE];
    }

    if (props[ATTR.ON_CONFIG_CREATE] !== undefined) {
        directives[DPROPS.ON_CONFIG_CREATE] = props[ATTR.ON_CONFIG_CREATE];
        delete  props[ATTR.ON_CONFIG_CREATE];
    }

    if (props[ATTR.ON_BEFORE_MOUNT] !== undefined) {
        directives[DPROPS.ON_BEFORE_MOUNT] = props[ATTR.ON_BEFORE_MOUNT];
        delete  props[ATTR.ON_BEFORE_MOUNT];
    }

    if (props[ATTR.ON_MOUNT] !== undefined) {
        directives[DPROPS.ON_MOUNT] = props[ATTR.ON_MOUNT];
        delete  props[ATTR.ON_MOUNT];
    }

    if (props[ATTR.ON_MOUNT_ASYNC] !== undefined) {
        directives[DPROPS.ON_MOUNT_ASYNC] = props[ATTR.ON_MOUNT_ASYNC];
        delete  props[ATTR.ON_MOUNT_ASYNC];
    }

    if (props[ATTR.ON_BEFORE_UPDATE] !== undefined) {
        directives[DPROPS.ON_BEFORE_UPDATE] = props[ATTR.ON_BEFORE_UPDATE];
        delete  props[ATTR.ON_BEFORE_UPDATE];
    }

    if (props[ATTR.ON_UPDATE] !== undefined) {
        directives[DPROPS.ON_UPDATE] = props[ATTR.ON_UPDATE];
        delete  props[ATTR.ON_UPDATE];
    }

    if (props[ATTR.ON_DRAW_BY_PARENT] !== undefined) {
        directives[DPROPS.ON_DRAW_BY_PARENT] = props[ATTR.ON_DRAW_BY_PARENT];
        delete  props[ATTR.ON_DRAW_BY_PARENT];
    }

    if (props[ATTR.ON_AFTER_RENDER] !== undefined) {
        directives[DPROPS.ON_AFTER_RENDER] = props[ATTR.ON_AFTER_RENDER];
        delete  props[ATTR.ON_AFTER_RENDER];
    }

    if (props[ATTR.ON_BEFORE_UNMOUNT] !== undefined) {
        directives[DPROPS.ON_BEFORE_UNMOUNT] = props[ATTR.ON_BEFORE_UNMOUNT];
        delete  props[ATTR.ON_BEFORE_UNMOUNT];
    }

    if (props[ATTR.ON_UNMOUNT] !== undefined) {
        directives[DPROPS.ON_UNMOUNT] = props[ATTR.ON_UNMOUNT];
        delete  props[ATTR.ON_UNMOUNT];
    }

    if (props[ATTR.ON_BEFORE_DESTROY] !== undefined) {
        directives[DPROPS.ON_BEFORE_DESTROY] = props[ATTR.ON_BEFORE_DESTROY];
        delete  props[ATTR.ON_BEFORE_DESTROY];
    }

    if (props[ATTR.ON_DESTROY] !== undefined) {
        directives[DPROPS.ON_DESTROY] = props[ATTR.ON_DESTROY];
        delete  props[ATTR.ON_DESTROY];
    }

    if (props[ATTR.ON_LOAD_PROPS] !== undefined) {
        directives[DPROPS.ON_LOAD_PROPS] = props[ATTR.ON_LOAD_PROPS];
        delete  props[ATTR.ON_LOAD_PROPS];
    }

    return directives;
}

module.exports = {
    extract
};