module.exports = {
    lastId: 0,
    data: {},
    set(value) {
        let id = ++this.lastId;
        id = `/*=%{${id}}%=*/`;
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
    getAll(str) {
        return str.replace(/(\/\*=%{\d+}%=\*\/)/g, (match) => {
            let objValue = this.get(match);
            if (objValue !== undefined) {
                return objValue;
            } else
                return match;
        });
    },
    isValidId(id) {
        return /^\/\*=%{\d+}%=\*\/$/.test(id)
    },
    flush() {
        this.data = {};
    }
};