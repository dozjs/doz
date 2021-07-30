function getComponentName($child) {
    return $child._dozAttach.originalTagName || $child.nodeName.toLowerCase();
}
export default getComponentName;
