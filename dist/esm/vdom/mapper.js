const RND = Math.random();
const MAX_ID = 9007199254740990;
const REGEX_1 = new RegExp('(\\/\\*' + RND + '=%{\\d+}%=\\*\\/)', 'g');
const REGEX_2 = new RegExp('^\\/\\*' + RND + '=%{\\d+}%=\\*\\/$');
export const lastId = 0;
export const data = {};
export const set = moduleExports.set;
export const get = moduleExports.get;
export const getAll = moduleExports.getAll;
export function isValidId(id) {
    return REGEX_2.test(id);
}
export const flush = moduleExports.flush;
const moduleExports = {
    lastId,
    data,
    set(value, from) {
        // Reset counter
        if (this.lastId >= MAX_ID)
            this.lastId = 0;
        let id = ++this.lastId;
        id = `/*${RND}=%{${id}}%=*/`;
        //console.log('--->', id, value, from)
        this.data[id] = value;
        return id;
    },
    get(id) {
        if (!this.isValidId(id))
            return;
        id = id.trim();
        let res = this.data[id];
        delete this.data[id];
        //this.flush()
        return res;
    },
    getAll(str) {
        return str.replace(REGEX_1, (match) => {
            let objValue = this.get(match);
            if (objValue !== undefined) {
                return objValue;
            }
            else
                return match;
        });
    },
    isValidId,
    flush() {
        this.data = {};
    }
};
export default moduleExports;
