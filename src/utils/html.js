const html = {
    /**
     * Create DOM element
     * @param str html string or a single tag
     * @returns {Element | Node | null}
     */
    create: function (str) {
        let element;
        str = str.replace(/\n|\s{2,}/g,' ');
        str = str.replace(/[\t\r]/g,'');
        str = str.replace(/>\s+</g,'><');
        //str = str.replace(/>\s{2,}</g,'>&nbsp;<');
        str = str.trim();
        //console.log(str)
        if (/<.*>/g.test(str)) {
            let template = document.createElement('div');
            template.innerHTML = str;
            element = template.firstChild;
        } else {
            element = document.createElement(str);
        }

        if (!this.isValidNode(element))
            throw new Error('Element not valid');
        return element;
    },

    /**
     * Check if is a valid Node
     * @param {*} el
     * @returns {Boolean}
     */
    isValidNode: function (el) {
        return el && 'nodeType' in el;
    },

    getAllNodes: function (el) {

        const nodes = [];

        function scanner(n) {
            do {
                nodes.push(n);
                if (n.hasChildNodes()) {
                    scanner(n.firstChild)
                }

            } while (n = n.nextSibling)
        }

        scanner(el);

        return nodes;
    }
};

module.exports = html;