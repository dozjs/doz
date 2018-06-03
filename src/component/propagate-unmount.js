function propagateUnmount(instance) {
    Object.keys(instance.children).forEach(item =>{
        const child = instance.children[item];
        if (typeof child.onUnmount === 'function')
            child.onUnmount();
        propagateUnmount(child);
    });
}

module.exports = propagateUnmount;