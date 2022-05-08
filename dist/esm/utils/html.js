const regexN = /\n/g;
const regexS = /\s+/g;
const replace = ' ';
let decoder;
const html = {
    /**
     * Create DOM element
     * @param str html string
     * @param wrapper tag string
     * @returns {Element | Node | null}
     */
    create(str, wrapper) {
        let element;
        str = str.replace(regexN, replace);
        str = str.replace(regexS, replace);
        let template = document.createElement('div');
        template.innerHTML = str;
        if (wrapper && template.childNodes.length > 1) {
            element = document.createElement(wrapper);
            element.innerHTML = template.innerHTML;
        }
        else {
            element = template.firstChild || document.createTextNode('');
        }
        let fragment = document.createDocumentFragment();
        fragment.appendChild(element);
        return fragment;
        //return element;
    },
    decode(str) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = str;
        return decoder.textContent;
    }
};
export default html;
