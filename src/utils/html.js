const html = {
    /**
     * Create DOM element
     * @param str html string or a single tag
     * @returns {Element | Node | null}
     */
    create: function (str) {
        let element;
        str = str.replace(/\n|\t|\r|\s{2,}/g,'');

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

    /**
     * Append multiple elements into target element
     * @param {Element} target
     * @param {Array | Element} els
     * @returns {Element | Node | Error}
     */
    render: function (target, els) {
        els = Array.isArray(els) ? els : [els];
        if (!this.isValidNode(target))
            throw new Error('Require a valid HTML Element');

        els.forEach(function (el) {
            target.appendChild(el);
        });
        return target;
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

        //console.log('NODE-B',nodes);

        return nodes;
    }
};

module.exports = html;