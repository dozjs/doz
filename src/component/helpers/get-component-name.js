function getComponentName($child) {
    return $child._dozAttach.originalTagName || $child.nodeName.toLowerCase();
}

module.exports = getComponentName;