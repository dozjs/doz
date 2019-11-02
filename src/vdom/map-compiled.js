module.exports = {
    lastId: 0,
    data: {},
    //REGEX_STRING: '=%{\d+}%;',
    set(value) {
        let id = ++this.lastId;
        id = `=%{${id}}%;`;
        //console.log('--->', value)
        this.data[id] = value;
        return id;
    },
    get(id) {
        if (!this.isValidId(id)) return;
        id = id.trim();
        let res = this.data[id];
        delete this.data[id];
        return res;
    },
    isValidId(id) {
        return /^=%{\d+}%;$/.test(id)
        //return /=%{\d+}%;/.test(id)
    },
    flush() {
        this.data = {};
    }
};