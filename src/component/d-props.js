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

    if (props[ATTR.ID] !== undefined) {
        dProps['id'] = props[ATTR.ID];
        delete  props[ATTR.ID];
    }

    if (props[ATTR.ON_BEFORE_CREATE] !== undefined) {
        dProps['__onBeforeCreate'] = props[ATTR.ON_BEFORE_CREATE];
        delete  props[ATTR.ON_BEFORE_CREATE];
    }

    if (props[ATTR.ON_CREATE] !== undefined) {
        dProps['__onCreate'] = props[ATTR.ON_CREATE];
        delete  props[ATTR.ON_CREATE];
    }

    if (props[ATTR.ON_CONFIG_CREATE] !== undefined) {
        dProps['__onConfigCreate'] = props[ATTR.ON_CONFIG_CREATE];
        delete  props[ATTR.ON_CONFIG_CREATE];
    }

    if (props[ATTR.ON_BEFORE_MOUNT] !== undefined) {
        dProps['__onBeforeMount'] = props[ATTR.ON_BEFORE_MOUNT];
        delete  props[ATTR.ON_BEFORE_MOUNT];
    }

    if (props[ATTR.ON_MOUNT] !== undefined) {
        dProps['__onMount'] = props[ATTR.ON_MOUNT];
        delete  props[ATTR.ON_MOUNT];
    }

    if (props[ATTR.ON_MOUNT_ASYNC] !== undefined) {
        dProps['__onMountAsync'] = props[ATTR.ON_MOUNT_ASYNC];
        delete  props[ATTR.ON_MOUNT_ASYNC];
    }

    if (props[ATTR.ON_BEFORE_UPDATE] !== undefined) {
        dProps['__onBeforeUpdate'] = props[ATTR.ON_BEFORE_UPDATE];
        delete  props[ATTR.ON_BEFORE_UPDATE];
    }

    if (props[ATTR.ON_UPDATE] !== undefined) {
        dProps['__onUpdate'] = props[ATTR.ON_UPDATE];
        delete  props[ATTR.ON_UPDATE];
    }

    if (props[ATTR.ON_BEFORE_CREATE] !== undefined) {
        dProps['__onBeforeCreate'] = props[ATTR.ON_BEFORE_CREATE];
        delete  props[ATTR.ON_BEFORE_CREATE];
    }

    if (props[ATTR.ON_AFTER_RENDER] !== undefined) {
        dProps['__onAfterRender'] = props[ATTR.ON_AFTER_RENDER];
        delete  props[ATTR.ON_AFTER_RENDER];
    }

    if (props[ATTR.ON_BEFORE_UNMOUNT] !== undefined) {
        dProps['__onBeforeUnmount'] = props[ATTR.ON_BEFORE_UNMOUNT];
        delete  props[ATTR.ON_BEFORE_UNMOUNT];
    }

    if (props[ATTR.ON_UNMOUNT] !== undefined) {
        dProps['__onUnmount'] = props[ATTR.ON_UNMOUNT];
        delete  props[ATTR.ON_UNMOUNT];
    }

    if (props[ATTR.ON_BEFORE_DESTROY] !== undefined) {
        dProps['__onBeforeDestroy'] = props[ATTR.ON_BEFORE_DESTROY];
        delete  props[ATTR.ON_BEFORE_DESTROY];
    }

    if (props[ATTR.ON_DESTROY] !== undefined) {
        dProps['__onDestroy'] = props[ATTR.ON_DESTROY];
        delete  props[ATTR.ON_DESTROY];
    }

    return dProps;
}

module.exports = {
    extract
};