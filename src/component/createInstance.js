const html = require('../utils/html');
//const transformChildStyle = require('./helpers/transform-child-style');
const {COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, ALREADY_WALKED, REGEX} = require('../constants');
const collection = require('../collection');
const hooks = require('./hooks');
const {serializeProps} = require('../vdom/parser');
const hmr = require('./helpers/hmr');
const Component = require('./Component');
const propsInit = require('./helpers/propsInit');
const delay = require('../utils/delay');
const directive = require('../directives');
const getComponentName = require('./helpers/getComponentName');
const makeSureAttach = require('./makeSureAttach');

function createInstance(cfg = {}) {

    if (!cfg.root) return;

    if (!(cfg.mountMainComponent)) {
        if (cfg.template instanceof HTMLElement) {
            /*if (!cfg.template.parentNode)
                cfg.root.appendChild(cfg.template);*/
        } else if (typeof cfg.template === 'string') {
            cfg.template = html.create(cfg.template);
            //cfg.root.appendChild(cfg.template);
        }
    }

    let componentInstance = null;
    let cmpName;
    const trash = [];

    function appendChildrenToParent(parent, newElement) {
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
    }

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
                    //if (!REGEX.IS_CLASS.test(Function.prototype.toString.call(cmp.cfg))) {
                    if (!(cmp.cfg.prototype instanceof Component)) {
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

                    if (cmp.cfg.then) {
                        let loadingComponent = null;
                        let errorComponent = null;
                        if ($child.parentElement
                            && $child.parentElement._dozAttach
                            && $child.parentElement._dozAttach.props
                        ) {
                            if ($child.parentElement._dozAttach.props['d-async-loading'])
                                loadingComponent = $child.parentElement._dozAttach.props['d-async-loading'];
                            if ($child.parentElement._dozAttach.props['d-async-error'])
                                errorComponent = $child.parentElement._dozAttach.props['d-async-error'];
                        }
                        (($child, loadingComponent, errorComponent) => {
                            let loadingComponentElement = null;
                            let errorComponentElement = null;

                            if (loadingComponent) {
                                let __props = {}
                                let __componentDirectives = {}
                                if (typeof loadingComponent === 'object' && loadingComponent.component) {
                                    __props = loadingComponent.props || __props;
                                    __componentDirectives = loadingComponent.directives || __componentDirectives;
                                    loadingComponent = loadingComponent.component;
                                }
                                newElement = new loadingComponent({
                                    tag: loadingComponent.tag || 'loading-component',
                                    root: $child,
                                    app: cfg.app,
                                    props: __props,
                                    componentDirectives: __componentDirectives,
                                    parentCmp: parent.cmp || cfg.parent
                                });
                                loadingComponentElement = newElement;
                            }

                            cmp.cfg
                                .then(componentFromPromise => {
                                    //gestisco eventuale ES6 import
                                    if (typeof componentFromPromise === 'object') {
                                        let oKeys = Object.keys(componentFromPromise);
                                        componentFromPromise = componentFromPromise[oKeys[oKeys.length - 1]];
                                    }

                                    if (componentFromPromise.tag) {
                                        let newRootElement = document.createElement(componentFromPromise.tag);
                                        $child.replaceWith(newRootElement);
                                        $child = newRootElement;
                                    }

                                    newElement = new componentFromPromise({
                                        tag: cmp.tag || cmpName,
                                        root: $child,
                                        app: cfg.app,
                                        props,
                                        componentDirectives,
                                        parentCmp: parent.cmp || cfg.parent
                                    });

                                    propsInit(newElement);
                                    newElement.app.emit('componentPropsInit', newElement);
                                    if (loadingComponentElement) loadingComponentElement.destroy();
                                    _runMount(newElement)
                                    walk(newElement.getHTMLElement(), {cmp: newElement});
                                    appendChildrenToParent(parent, newElement);
                                })
                                .catch(e => {
                                    if (errorComponent) {
                                        let __props = {}
                                        let __componentDirectives = {}
                                        if (typeof errorComponent === 'object' && errorComponent.component) {
                                            __props = errorComponent.props || __props
                                            __componentDirectives = errorComponent.directives || __componentDirectives
                                            errorComponent = errorComponent.component;
                                        }

                                        newElement = new errorComponent({
                                            tag: errorComponent.tag || 'error-component',
                                            root: $child,
                                            app: cfg.app,
                                            props: __props,
                                            componentDirectives: __componentDirectives,
                                            parentCmp: parent.cmp || cfg.parent
                                        });
                                        errorComponentElement = newElement;
                                    }
                                    console.error(e)
                                })
                        })($child, loadingComponent, errorComponent)

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
                }

                if (!newElement) {
                    $child = $child.nextElementSibling;
                    continue;
                }

                newElement.rawChildrenObject = $child._dozAttach.elementChildren;

                newElement.$domEl = $child;

                if (typeof newElement.module === 'object') {
                    hmr(newElement, newElement.module);
                }

                propsInit(newElement);

                newElement.app.emit('componentPropsInit', newElement);

                function _runMount(_newElement = null) {
                    newElement = _newElement || newElement;
                    if (newElement._isRendered) return;

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
                    //if (newElement.waitMount) {
                    //console.log(cfg.app._onAppComponentsMounted.size, newElement.tag)

                    if (newElement.waitMount) {
                        //cfg.app._onAppComponentsMounted.set(newElement, true);
                        if (!newElement.appReadyExcluded)
                            cfg.app._onAppComponentsMounted.delete(newElement);
                    }
                }

                if (newElement.waitMount) {
                    //console.log(cfg.app._onAppComponentsMounted)
                    if (!newElement.appReadyExcluded)
                        cfg.app._onAppComponentsMounted.set(newElement, false);
                    newElement.runMount = _runMount;
                    hooks.callWaitMount(newElement);
                } else if (hooks.callBeforeMount(newElement) !== false) {
                    _runMount()
                } else {
                    newElement.runMount = _runMount
                }

                parentElement = newElement;

                appendChildrenToParent(parent, newElement);
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
            props: cfg.props || {},
            componentDirectives: {},
            parentCmp: null,//parent.cmp || cfg.parent
        });

        propsInit(newElement);
        newElement.app.emit('componentPropsInit', newElement);

        newElement._isRendered = true;
        newElement._mainComponentByAppCreate = true;
        newElement.render(true);

        if (cfg.innerHTML) {
            let innerHTMLEl = html.create(cfg.innerHTML, 'div');
            innerHTMLEl.childNodes.forEach(child => {
                newElement.getHTMLElement().appendChild(child);
            })
        }

        walk(newElement.getHTMLElement(), {cmp: newElement})
        trash.forEach($child => $child.remove());

        hooks.callMount(newElement);
        hooks.callMountAsync(newElement);
        cfg.root.appendChild(cfg.template);
        return newElement;

    } else {
        walk(cfg.template);
        trash.forEach($child => $child.remove());
        cfg.root.appendChild(cfg.template);
        return componentInstance;
    }
}

module.exports = createInstance;