const html = require('../html');

const vModel = [
    {
        type: 'HTMLElement',
        tag: 'div',
        ref: {},
        attributes: [
            {
                name: 'href',
                value: 'http://',
                ref: {}
            }
        ],
        children: [
            {
                /*

                 */
            }
        ]
    }
];

function createVirtual(el) {

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

function parser(element) {
    const nodes = createVirtual(element);
    console.log('name',nodes[2].attributes[0].nodeName);
    console.log('val',nodes[2].attributes[0].nodeValue);
    //console.log(element.firstChild);
}

module.exports = {
    parser
};