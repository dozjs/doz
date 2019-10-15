function extendInstance(instance, cfg, dProps) {
    Object.assign(instance, cfg, dProps);
}

module.exports = extendInstance;