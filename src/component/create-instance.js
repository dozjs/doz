const html = require('../utils/html');
//const transformChildStyle = require('./helpers/transform-child-style');
const {COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, ALREADY_WALKED, REGEX} = require('../constants');
const collection = require('../collection');
const hooks = require('./hooks');
const {serializeProps} = require('../vdom/parser');
const hmr = require('./helpers/hmr');
const Component = require('./Component');
const propsInit = require('./helpers/props-init');
const delay = require('../utils/delay');
const directive = require('../directives');
const getComponentName = require('./helpers/get-component-name');
const makeSureAttach = require('./make-sure-attach');

function createInstance(cfg = {}) {

    if (!cfg.root) return;

    if (!cfg.mountMainComponent) {
        if (cfg.template instanceof HTMLElement) {
            if (!cfg.template.parentNode)
                cfg.root.appendChild(cfg.template);
        } else if (typeof cfg.template === 'string') {
            cfg.template = html.create(cfg.template);
            cfg.root.appendChild(cfg.template);
        }
    }

    let componentInstance = null;
    let cmpName;
    const trash = [];

    function walk($child, parent = {}) {
        while ($child) {

            makeSureAttach($child);

            // Non bella ma funziona
            if (!$child._dozAttach[ALREADY_WALKED]) {
                $child._dozAttach[ALREADY_WALKED] = true;
            } else {
                $child = $child.nextElementSibling;
                continue;
            }

            directive.callAppWalkDOM(parent, $child);

            cmpName = getComponentName($child);

            directive.callAppComponentAssignName(parent, $child, (name) => {
                cmpName = name;
            });

            let localComponents = {};

            if (parent.cmp && parent.cmp._components) {
                localComponents = parent.cmp._components;
            }

            const cmp = cfg.autoCmp ||
                localComponents[cmpName] ||
                cfg.app._components[cmpName] ||
                collection.getComponent(cmpName);

            let parentElement;

            if (cmp) {
                //console.log(cmpName)
                if (parent.cmp) {

                    const rawChild = $child.outerHTML;
                    parent.cmp.rawChildren.push(rawChild);
                }

                // For node created by mount method
                if (parent.cmp && parent.cmp.mounted) {
                    $child = $child.nextElementSibling;
                    continue;
                }

                if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                    trash.push($child);
                    $child = $child.nextElementSibling;
                    continue;
                }

                const props = serializeProps($child);

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
                    $child = $child.nextElementSibling;
                    continue;
                }

                newElement.rawChildrenObject = $child._dozAttach.elementChildren;

                if (typeof newElement.module === 'object') {
                    hmr(newElement, newElement.module);
                }

                propsInit(newElement);

                newElement.app.emit('componentPropsInit', newElement);

                function _runMount() {
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
                    // This is an hack for call render a second time so the
                    // event onAppDraw and onDrawByParent are fired after
                    // that the component is mounted.
                    // This hack makes also the component that has keys
                    // Really this hack is very important :D :D
                    delay(() => {
                        newElement.render(false, [], true);
                    });
                    hooks.callMount(newElement);
                    hooks.callMountAsync(newElement);
                }

                if (newElement.waitMount) {
                    newElement.runMount = _runMount;
                    hooks.callWaitMount(newElement);
                } else if (hooks.callBeforeMount(newElement) !== false) {
                    _runMount()
                } else {
                    newElement.runMount = _runMount
                }

                parentElement = newElement;
                //console.log(parent)
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
                    walk($child.firstElementChild, {cmp: parentElement})
                } else {
                    walk($child.firstElementChild, {cmp: parent.cmp})
                }
            }

            $child = $child.nextElementSibling;
        }
    }

    if (cfg.mountMainComponent) {
        // Monto il componente principale
        let newElement = new cfg.component({
            //tag: 'bbb-bbb',//cmp.tag || cmpName,
            cmp: cfg.component,
            root: cfg.root,
            app: cfg.app,
            props: {},
            componentDirectives: {},
            parentCmp: null,//parent.cmp || cfg.parent
        });

        propsInit(newElement);
        newElement.app.emit('componentPropsInit', newElement);

        newElement._isRendered = true;
        newElement._mainComponentByAppCreate = true;
        newElement.render(true);

        if (cfg.innerHTML) {
            //console.log(cfg.innerHTML)
            let innerHTMLEl = html.create(cfg.innerHTML, 'div');
            //console.log(innerHTMLEl)
            //let newElementHTMLElement = newElement.getHTMLElement();
            innerHTMLEl.childNodes.forEach(child => {
                newElement.getHTMLElement().appendChild(child);
            })

        }

        //console.log('mmmmmmmmmmmmmmmmmmmm', {cmp: newElement})
        walk(newElement.getHTMLElement(), {cmp: newElement})
        trash.forEach($child => $child.remove());

        hooks.callMount(newElement);
        hooks.callMountAsync(newElement);

        return newElement;

    } else {
        walk(cfg.template);
        trash.forEach($child => $child.remove());

        return componentInstance;
    }
}

module.exports = createInstance;