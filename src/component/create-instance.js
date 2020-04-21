const html = require('../utils/html');
const transformChildStyle = require('./helpers/transform-child-style');
const {COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, ALREADY_WALKED, COMPONENT_DYNAMIC_INSTANCE, DEFAULT_SLOT_KEY, PROPS_ATTRIBUTES, REGEX} = require('../constants');
const collection = require('../collection');
const hooks = require('./hooks');
const {serializeProps} = require('../vdom/parser');
const hmr = require('./helpers/hmr');
const Component = require('./Component');
const propsInit = require('./helpers/props-init');
const delay = require('../utils/delay');
const directive = require('../directives');
const getComponentName = require('./helpers/get-component-name');
const createAttachElement = require('./make-sure-attach');

function createInstance(cfg = {}) {

    if (!cfg.root) return;

    if (cfg.template instanceof HTMLElement) {
        if (!cfg.template.parentNode)
            cfg.root.appendChild(cfg.template);
    } else if (typeof cfg.template === 'string') {
        cfg.template = html.create(cfg.template);
        cfg.root.appendChild(cfg.template);
    }

    //console.log('HTML, ', cfg.template)

    let componentInstance = null;
    let cmpName;
    let isChildStyle;
    const trash = [];

    //console.log(cfg.root.outerHTML)

    function walk($child, parent = {}) {
        while ($child) {

            createAttachElement($child);

            // Non bella ma funziona
            if (!$child._dozAttach[ALREADY_WALKED]) {
                $child._dozAttach[ALREADY_WALKED] = true;
            } else {
                $child = $child.nextSibling;
                continue;
            }

            directive.callAppWalkDOM(parent, $child);

            isChildStyle = transformChildStyle($child, parent);

            if (isChildStyle) {
                $child = isChildStyle;
                continue;
            }

            cmpName = getComponentName($child);

            directive.callAppComponentAssignName(parent, $child, (name) => {
                cmpName = name;
            });

            let localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            //console.log('_______', cmpName);

            const cmp = cfg.autoCmp ||
                localComponents[cmpName] ||
                cfg.app._components[cmpName] ||
                collection.getComponent(cmpName);

            let parentElement;

            if (cmp) {

                if (parent.cmp) {

                    const rawChild = $child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                    //console.log(parent)
                    //console.log('--->', $child.dozElementChildren)
                }

                // For node created by mount method
                if (parent.cmp && parent.cmp.mounted) {
                    $child = $child.nextSibling;
                    continue;
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push($child);
                    $child = $child.nextSibling;
                    continue;
                }

                // Disable this because animation doesn't works
                /*
                // Replace possible child name generated automatically
                // Tags generated automatically are like my-tag-1-0
                // This block transforms to original tag like my-tag
                if (cmp.tag && cmpName !== cmp.tag) {
                    let $newNodeChild = document.createElement(cmp.tag);

                    while ($child.childNodes.length > 0) {
                        $newNodeChild.appendChild($child.childNodes[0]);
                    }

                    $child.parentNode.replaceChild($newNodeChild, $child);
                    // Copy all attributes
                    [...$child.attributes].forEach(attr => {
                        $newNodeChild.setAttribute(attr.nodeName, attr.nodeValue)
                    });
                    // Copy all specials Doz properties attached to element
                    if ($child._dozAttach[COMPONENT_INSTANCE])
                        $newNodeChild._dozAttach[COMPONENT_INSTANCE] = $child._dozAttach[COMPONENT_INSTANCE];
                    if ($child._dozAttach[COMPONENT_DYNAMIC_INSTANCE])
                        $newNodeChild._dozAttach[COMPONENT_DYNAMIC_INSTANCE] = $child._dozAttach[COMPONENT_DYNAMIC_INSTANCE];
                    if ($child._dozAttach[COMPONENT_ROOT_INSTANCE])
                        $newNodeChild._dozAttach[COMPONENT_ROOT_INSTANCE] = $child._dozAttach[COMPONENT_ROOT_INSTANCE];
                    if ($child._dozAttach[PROPS_ATTRIBUTES])
                        $newNodeChild._dozAttach[PROPS_ATTRIBUTES] = $child._dozAttach[PROPS_ATTRIBUTES];
                    if ($child._dozAttach[ALREADY_WALKED])
                        $newNodeChild._dozAttach[ALREADY_WALKED] = $child._dozAttach[ALREADY_WALKED];
                    if ($child._dozAttach[DEFAULT_SLOT_KEY])
                        $newNodeChild._dozAttach[DEFAULT_SLOT_KEY] = $child._dozAttach[DEFAULT_SLOT_KEY];

                    $child = $newNodeChild;
                }
                */

                const props = serializeProps($child);

                //console.log('serialized', props)

                const componentDirectives = {};

                let newElement;

                if (typeof cmp.cfg === 'function') {
                    // This implements single function component
                    if (!REGEX.IS_CLASS.test(Function.prototype.toString.call(cmp.cfg))) {
                        const func = cmp.cfg;
                        cmp.cfg = class extends Component {
                        };
                        cmp.cfg.prototype.template = func;
                    }

                    newElement = new cmp.cfg({
                        tag: cmp.tag || cmpName,
                        root: $child,
                        app: cfg.app,
                        props,
                        componentDirectives,
                        parentCmp: parent.cmp || cfg.parent
                    });
                } else {
                    newElement = new Component({
                        tag: cmp.tag || cmpName,
                        cmp,
                        root: $child,
                        app: cfg.app,
                        props,
                        componentDirectives,
                        parentCmp: parent.cmp || cfg.parent
                    });
                }

                if (!newElement) {
                    $child = $child.nextSibling;
                    continue;
                }

                newElement.rawChildrenObject = $child._dozAttach.elementChildren;

                if (typeof newElement.module === 'object') {
                    hmr(newElement, newElement.module);
                }

                propsInit(newElement);

                newElement.app.emit('componentPropsInit', newElement);

                if (hooks.callBeforeMount(newElement) !== false) {

                    newElement._isRendered = true;
                    newElement.render(true);

                    if (!componentInstance) {
                        componentInstance = newElement;
                    }

                    newElement._rootElement._dozAttach[COMPONENT_ROOT_INSTANCE] = newElement;
                    newElement.getHTMLElement()._dozAttach[COMPONENT_INSTANCE] = newElement;

                    // Replace first element child if defaultSlot exists with a slot comment
                    if (newElement._defaultSlot && newElement.getHTMLElement().firstElementChild) {
                        let slotPlaceholder = document.createComment('slot');
                        newElement.getHTMLElement().replaceChild(slotPlaceholder, newElement.getHTMLElement().firstElementChild);
                    }

                    //$child.insertBefore(newElement._rootElement, $child.firstChild);

                    // This is an hack for call render a second time so the
                    // event onAppDraw and onDrawByParent are fired after
                    // that the component is mounted.
                    // This hack makes also the component that has keys
                    // Really this hack is very important :D :D
                    delay(() => {
                        newElement.render(false, [], true)
                    });

                    hooks.callMount(newElement);
                    hooks.callMountAsync(newElement);
                }

                parentElement = newElement;

                if (parent.cmp) {
                    let n = Object.keys(parent.cmp.children).length++;
                    directive.callAppComponentAssignIndex(newElement, n, (index) => {
                        parent.cmp.children[index] = newElement;
                    });

                    if (parent.cmp.childrenByTag[newElement.tag] === undefined) {
                        parent.cmp.childrenByTag[newElement.tag] = [newElement];
                    } else {
                        parent.cmp.childrenByTag[newElement.tag].push(newElement);
                    }

                }

                cfg.autoCmp = null;
            }

            if ($child.hasChildNodes()) {
                if (parentElement) {
                    walk($child.firstChild, {cmp: parentElement})
                } else {
                    walk($child.firstChild, {cmp: parent.cmp})
                }
            }

            $child = $child.nextSibling;
        }
    }

    walk(cfg.template);

    trash.forEach($child => $child.remove());

    return componentInstance;
}

module.exports = createInstance;