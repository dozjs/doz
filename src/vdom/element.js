const {attach, updateAttributes} = require('./attributes');
const deadChildren = [];
const {INSTANCE, TAG, NS, CMP_INSTANCE, ATTR, DIR_IS} = require('../constants');
const html = require('../utils/html');
const composeStyleInner = require('../utils/compose-style-inner');

const storeElementNode = Object.create(null);

function isChanged(nodeA, nodeB) {
    return typeof nodeA !== typeof nodeB ||
        typeof nodeA === 'string' && nodeA !== nodeB ||
        nodeA.type !== nodeB.type ||
        nodeA.props && nodeA.props.forceupdate;
}

function canDecode(str) {
    return /&\w+;/.test(str)
        ? html.decode(str)
        : str
}

function create(node, cmp, initial) {
    if (typeof node === 'undefined') return;

    let nodeStored;
    let $el;

    if (typeof node === 'string') {
        return document.createTextNode(
            // use decode only if necessary
            canDecode(node)
        );
    }

    if (node.type[0] === '#') {
        node.type = TAG.EMPTY;
    }

    nodeStored = storeElementNode[node.type];
    if (nodeStored) {
        $el = nodeStored.cloneNode();
    } else {
        $el = node.isSVG
            ? document.createElementNS(NS.SVG, node.type)
            : document.createElement(node.type);

        storeElementNode[node.type] = $el.cloneNode(true);
    }

    attach($el, node.props, cmp);

    node.children
        .map(item => create(item, cmp, initial))
        .forEach($el.appendChild.bind($el));
    if (typeof $el.hasAttribute === 'function')
        if ((node.type.indexOf('-') !== -1
            || (typeof $el.hasAttribute === 'function' && $el.hasAttribute(ATTR.IS)))
            && !initial) {
            cmp._processing.push({node: $el, action: 'create'});
        }

    return $el;
}

function update($parent, newNode, oldNode, index = 0, cmp, initial) {

    if (!$parent) return;

    if (!oldNode) {
        const rootElement = create(newNode, cmp, initial);
        $parent.appendChild(rootElement);
        return rootElement;
    } else if (!newNode) {
        if ($parent.childNodes[index]) {
            deadChildren.push($parent.childNodes[index]);
        }
    } else if (isChanged(newNode, oldNode)) {
        const oldElement = $parent.childNodes[index];
        // Reuse text node
        if (typeof newNode === 'string' && typeof oldNode === 'string' && oldElement) {
            oldElement.textContent = canDecode(newNode);
            if($parent.nodeName === 'SCRIPT') {
                // it could be heavy
                if ($parent.type === 'text/style' && $parent.dataset.id && $parent.dataset.owner) {
                    document.getElementById($parent.dataset.id).textContent = composeStyleInner(oldElement.textContent, $parent.dataset.owner, $parent.dataset.ownerByData);
                }
            }
            return oldElement;
        }

        if (!oldElement) return;

        const newElement = create(newNode, cmp, initial);

        //Re-assign CMP INSTANCE to new element
        if (oldElement[CMP_INSTANCE]) {
            newElement[CMP_INSTANCE] = oldElement[CMP_INSTANCE];
            newElement[CMP_INSTANCE]._rootElement = newElement;
        }

        $parent.replaceChild(
            newElement,
            oldElement
        );

        return newElement;
    } else if (newNode.type) {

        let updated = updateAttributes(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props,
            cmp
        );

        if ($parent.childNodes[index]) {
            const dynInstance = $parent.childNodes[index][INSTANCE];
            if (dynInstance && updated.length) {
                updated.forEach(props => {
                    Object.keys(props).forEach(name => {
                        dynInstance.props[name] = props[name]
                    })
                });

                return;
            }
        }

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;

        for (let i = 0; i < newLength || i < oldLength; i++) {
            update(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i,
                cmp,
                initial
            );
        }

        clearDead();
    }
}

function clearDead() {
    let dl = deadChildren.length;

    while (dl--) {
        deadChildren[dl].parentNode.removeChild(deadChildren[dl]);
        deadChildren.splice(dl, 1);
    }
}

module.exports = {
    create,
    update
};