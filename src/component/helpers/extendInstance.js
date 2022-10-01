function extendInstance(instance, cfg, dProps) {
    //console.log(cfg, dProps)
    Object.assign(instance, cfg, dProps);
}
export default extendInstance;
