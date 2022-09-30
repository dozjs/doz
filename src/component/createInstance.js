import html from "../utils/html.js";
import {COMPONENT_ROOT_INSTANCE, COMPONENT_INSTANCE, ALREADY_WALKED, REGEX} from "../constants.js";
import collection from "../collection.js";
import hooks from "./hooks.js";
import {serializeProps} from "../vdom/parser.js";
import hmr from "./helpers/hmr.js";
import Component from "./Component.js";
import propsInit from "./helpers/propsInit.js";
import delay from "../utils/delay.js";
import directive from "../directives/index.js";
import getComponentName from "./helpers/getComponentName.js";
import makeSureAttach from "./makeSureAttach.js";

function appendChildrenToParent(parent, newElement) {
    //console.log('newElement',newElement.tag,'parent.cmp', parent.cmp.tag, 'che ha', Object.keys(parent.cmp.children).length)
    if (parent.cmp) {
        let n = Object.keys(parent.cmp.children).length++;
        directive.callAppComponentAssignIndex(newElement, n, (index) => {
            //console.log(parent.cmp.tag)
            parent.cmp.children[index] = newElement;
        });
        if (parent.cmp.childrenByTag[newElement.tag] === undefined) {
            parent.cmp.childrenByTag[newElement.tag] = [newElement];
        } else {
            parent.cmp.childrenByTag[newElement.tag].push(newElement);
        }
    }
    //console.log('diventano', Object.keys(parent.cmp.children).length)
}

function createInstance(cfg = {}) {
    /*if (!cfg.root)
        return;*/

    if (cfg.root) {
        if (!(cfg.mountMainComponent)) {
            if (cfg.template instanceof HTMLElement) {
                /*if (!cfg.template.parentNode)
                    cfg.root.appendChild(cfg.template);*/
            } else if (typeof cfg.template === 'string') {
                //console.log('create tpl html')
                cfg.template = html.create(cfg.template);
                cfg.root.appendChild(cfg.template);
            }
        }
    }

    let componentInstance = null;
    let cmpName;
    const trash = [];


    function flushTrash() {
        trash.forEach($child => $child.remove());
    }

    //let walkCount = 0;

    function walk($child, parent = {}) {
        //console.log('WALK COUNT', walkCount++, $child.nodeName)
        //console.log('parent', parent)
        //console.log('aaaaaaaaaa', $child)
        //while ($child) {
        makeSureAttach($child);
        // it is not good but it works
        if (!$child._dozAttach[ALREADY_WALKED]) {
            $child._dozAttach[ALREADY_WALKED] = true;
            //$child._countWalk = 0;
        } else {
            //console.log('already walked')
            return;
        }
        /*else {
            //console.log('already walked', $child.outerHTML)
            $child = $child.nextElementSibling;
            //continue;
        }*/
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

        //console.log(cmp)

        if (cmp) {
            if (parent.cmp) {
                const rawChild = $child.outerHTML;
                parent.cmp.rawChildren.push(rawChild);
            }
            // For node created by mount method
            if (parent.cmp && parent.cmp.mounted) {
                return;
                //$child = $child.nextElementSibling;
                //continue;
            }
            if (parent.cmp && parent.cmp.autoCreateChildren === false) {
                trash.push($child);
                return;
                //$child = $child.nextElementSibling;
                //continue;
            }
            const props = serializeProps($child);
            const componentDirectives = {};
            const parentCmp = parent.cmp || cfg.parent
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
                    parentCmp
                    //parentCmp: parent.cmp || cfg.parent
                });
            } else {
                if (cmp.cfg.then) {
                    let loadingComponent = null;
                    let errorComponent = null;
                    if ($child.parentElement
                        && $child.parentElement._dozAttach
                        && $child.parentElement._dozAttach.props) {
                        if ($child.parentElement._dozAttach.props['d-async-loading'])
                            loadingComponent = $child.parentElement._dozAttach.props['d-async-loading'];
                        if ($child.parentElement._dozAttach.props['d-async-error'])
                            errorComponent = $child.parentElement._dozAttach.props['d-async-error'];
                    }
                    (($child, loadingComponent, errorComponent) => {
                        let loadingComponentElement = null;
                        let errorComponentElement = null;
                        if (loadingComponent) {
                            let __props = {};
                            let __componentDirectives = {};
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
                                parentCmp
                                //parentCmp: parent.cmp || cfg.parent
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
                                    parentCmp
                                    //parentCmp: parent.cmp || cfg.parent
                                });
                                propsInit(newElement);
                                newElement.app.emit('componentPropsInit', newElement);
                                if (loadingComponentElement)
                                    loadingComponentElement.destroy();
                                _runMount(newElement);
                                walk(newElement.getHTMLElement(), {cmp: newElement});
                                appendChildrenToParent(parent, newElement);
                            })
                            .catch(e => {
                                if (errorComponent) {
                                    let __props = {};
                                    let __componentDirectives = {};
                                    if (typeof errorComponent === 'object' && errorComponent.component) {
                                        __props = errorComponent.props || __props;
                                        __componentDirectives = errorComponent.directives || __componentDirectives;
                                        errorComponent = errorComponent.component;
                                    }
                                    newElement = new errorComponent({
                                        tag: errorComponent.tag || 'error-component',
                                        root: $child,
                                        app: cfg.app,
                                        props: __props,
                                        componentDirectives: __componentDirectives,
                                        parentCmp
                                        //parentCmp: parent.cmp || cfg.parent
                                    });
                                    errorComponentElement = newElement;
                                }
                                console.error(e);
                            });
                    })($child, loadingComponent, errorComponent);
                } else {
                    //if (!cfg.simulateNull)
                    newElement = new Component({
                        tag: cmp.tag || cmpName,
                        cmp,
                        root: $child,
                        app: cfg.app,
                        props,
                        componentDirectives,
                        parentCmp
                        //parentCmp: parent.cmp || cfg.parent
                    });
                }
            }
            if (newElement && newElement.__beforeCreateReturnsFalse) {
                newElement = undefined;
            }
            if (!newElement) {
                return;
                //$child = $child.nextElementSibling;
                //continue;
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
                if (newElement._isRendered)
                    return;
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

                // This is a hack for call render a second time so the
                // event onAppDraw and onDrawByParent are fired after
                // that the component is mounted.
                // This hack makes also the component that has keys
                // Really this hack is very important :D :D
                // delay(() => {
                //      newElement.render(false, [], true);
                // });

                if (newElement._hasSlots && parentCmp) {
                    delay(() =>
                        parentCmp.render(false, [], true)
                    );
                }

                hooks.callMount(newElement);
                hooks.callMountAsync(newElement);

                if (newElement.waitMount) {
                    //cfg.app._onAppComponentsMounted.set(newElement, true);
                    walk(newElement.getHTMLElement().firstElementChild, {cmp: newElement});
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
                _runMount();
            } else {
                newElement.runMount = _runMount;
            }
            //parentElement = newElement;
            appendChildrenToParent(parent, newElement);
            cfg.autoCmp = null;
        }
        /*if ($child.firstElementChild) {
            let _cmp = parentElement ? parentElement : parent.cmp;
            walk($child.firstElementChild, {
                cmp: _cmp
            })
        }
        $child = $child.nextElementSibling;
        */
        //}
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
            parentCmp: null,
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
            });
        }
        walk(newElement.getHTMLElement(), {cmp: newElement});
        flushTrash()
        hooks.callMount(newElement);
        hooks.callMountAsync(newElement);
        return newElement;
    } else {
        //if (cfg.parent)
        //console.log(cfg.parent.tag)
        //console.log(cfg.template.outerHTML)
        walk(cfg.template, {cmp: cfg.parent});
        flushTrash()
        return componentInstance;
    }
}

export default createInstance;