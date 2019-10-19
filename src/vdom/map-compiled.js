module.exports = {
    lastId: 0,
    data: {},
    set(value) {
        let id = ++this.lastId;
        id = `=%{${id}}%;`;
        this.data[id] = value;
        return id;
    },
    get(id) {
        if (!this.isValidId(id)) return;
        let res = this.data[id];
        delete this.data[id];
        return res;
    },
    isValidId(id) {
        return /=%{\d+}%;/.test(id)
    },
    flush() {
        this.data = {};
    }
};