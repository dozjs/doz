/**
 * @class
 */
class Spye {

    /**
     * Create instance
     * @param query {Object} element that you want watch
     * @param [opts] {Object} configuration object
     * @param [opts.autoWatch=true] {boolean} auto watch
     * @param [opts.unwatchAfterCreate=false] {boolean} stop check after detect element creation
     * @param [opts.unwatchAfterRemove=false] {boolean} stop check after detect element remove
     */
    constructor(element, opts = {}) {

        this.opts = Object.assign({}, {
            autoWatch: true,
            unwatchAfterCreate: false,
            unwatchAfterRemove: false,
        }, opts);

        this.element = element;

        this._checkCount = 0;

        this._created = null;

        this._onCreate = () => {
        };

        this._onRemove = () => {
        };

        if (this.opts.autoWatch)
            this.watch();
    }

    /**
     * Check
     * @returns {Spye}
     * @ignore
     * @private
     */
    check() {
        ++this._checkCount;
        let exists = document.body.contains(this.element);
        if (exists && !this._created) {
            this._created = true;
            this._onCreate.call(null, this.element, this);
            if (this.opts.unwatchAfterCreate)
                this.unwatch();
        }
        if (!exists && this._created) {
            this._created = false;
            this._onRemove.call(null, this);
            if (this.opts.unwatchAfterRemove)
                this.unwatch();
        }

        return this;
    }

    /**
     * Start watching
     * @returns {Spye}
     */
    watch() {
        this._tick = requestAnimationFrame(() => {
            this.check();
        });
        return this;
    }

    /**
     * Stop watching
     * @returns {Spye}
     */
    unwatch() {
        cancelAnimationFrame(this._tick);
        this._tick = null;
        return this;
    }

    /**
     * Fired when element is created
     * @param callback
     * @returns {Spye}
     */
    onCreate(callback) {
        this._onCreate = callback;
        return this;
    }

    /**
     * Fired when element is removed
     * @param callback
     * @returns {Spye}
     */
    onRemove(callback) {
        this._onRemove = callback;
        return this;
    }

}

module.exports = Spye;