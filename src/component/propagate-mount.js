function propagateMount(instance) {
    Object.keys(instance.children).forEach(item =>{
        const child = instance.children[item];
        if (typeof child.onMount === 'function')
            child.onMount();
        propagateMount(child);
    });
}

module.exports = propagateMount;