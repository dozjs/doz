const regexN = /\n/g;
const regexS = /\s+/g;
const replace = ' ';

const html = {
    /**
     * Create DOM element
     * @param str html string
     * @returns {Element | Node | null}
     */
    create: function (str) {
        let element;
        str = str.replace(regexN, replace);
        str = str.replace(regexS, replace);

        let template = document.createElement('div');
        template.innerHTML = str;
        element = template.firstChild;

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
            while (n) {
                nodes.push(n);
                if (n.hasChildNodes()) {
                    scanner(n.firstChild)
                }
                n = n.nextSibling;
            }
        }

        scanner(el);

        return nodes;
    }
};

module.exports = html;