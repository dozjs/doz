const RND = Math.random();

const REGEX_1 = new RegExp('(\\/\\*' + RND + '=%{\\d+}%=\\*\\/)', 'g');
const REGEX_2 = new RegExp('^\\/\\*' + RND + '=%{\\d+}%=\\*\\/$');

module.exports = {
    lastId: 0,
    data: {},
    set(value) {
        let id = ++this.lastId;
        id = `/*${RND}=%{${id}}%=*/`;
        //console.log('--->', id, value)
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
        return str.replace(REGEX_1, (match) => {
            let objValue = this.get(match);
            if (objValue !== undefined) {
                return objValue;
            } else
                return match;
        });
    },
    isValidId(id) {
        return REGEX_2.test(id)
    },
    flush() {
        this.data = {};
    }
};