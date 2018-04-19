module.exports = {
    addItem(item) {
        this.getStore('list').record.push(item)
    },
    removeItem(index) {
        this.getStore('list').record.splice(index, 1);
    }
};