const {directive} = require('../index');
const {COMPONENT_DYNAMIC_INSTANCE} = require('../../constants');
const ATTR_KEY = 'data-key';

directive('key', {

    onAppComponentCreate(instance) {
        Object.defineProperties(instance, {
            _dynamicNodes: {
                value: {},
                writable: true
            },
            _keyedNodes: {
                value: {},
                writable: true
            }
        });
    },

    onAppComponentPropsAssignName($target, propName, propValue, isDirective, props) {
        if (propName === ATTR_KEY) {
            props.key = propValue;
        }
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        $target.dataset.key = directiveValue;
        instance._keyedNodes[directiveValue] = $target;
    },

    onAppDynamicInstanceCreate(instance, dynamicInstance, item) {
        if (item.node.dataset.key) {
            instance._dynamicNodes[item.node.dataset.key] = dynamicInstance._rootElement.parentNode;
        }
    },

    //todo bisogna gestire le key anche per i non componenti
    onAppComponentRenderOverwrite(instance, changes, next, prev) {
        let candidateKeyToRemove;
        let thereIsDelete = false;
        changes.forEach((change) => {
            //console.log(change);
            // Trova la presunta chiave da eliminare
            if (Array.isArray(change.target)) {
                if ((change.type === 'update' || change.type === 'delete') && candidateKeyToRemove === undefined) {

                    if (change.previousValue && typeof change.previousValue === 'object' && change.previousValue.key !== undefined) {
                        candidateKeyToRemove = change.previousValue.key;
                    }
                }
                if (change.type === 'delete')
                    thereIsDelete = true;
            }

            // Se l'array viene svuotato allora dovrò cercare tutte le eventuali chiavi che fanno riferimento ai nodi
            if (candidateKeyToRemove === undefined && (Array.isArray(change.previousValue) && !Array.isArray(change.newValue))
                || (Array.isArray(change.previousValue) && change.previousValue.length > change.newValue.length)
            ) {
                change.previousValue.forEach(item => {
                    if (item && typeof item === 'object' && item.key !== undefined && instance._dynamicNodes[item.key] !== undefined) {
                        if (instance._dynamicNodes[item.key][COMPONENT_DYNAMIC_INSTANCE]) {
                            instance._dynamicNodes[item.key][COMPONENT_DYNAMIC_INSTANCE].destroy();
                        } else {
                            instance._dynamicNodes[item.key].parentNode.removeChild(instance._dynamicNodes[item.key]);
                        }
                    }
                });
            }
        });

        //console.log(thereIsDelete, candidateKeyToRemove)

        if (!thereIsDelete)
            candidateKeyToRemove = undefined;

        if (candidateKeyToRemove !== undefined) {
            console.log(instance._keyedNodes, candidateKeyToRemove)
            if (instance._dynamicNodes[candidateKeyToRemove] !== undefined) {
                if (instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE]) {
                    instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE].destroy();
                } else {
                    //console.log(instance._dynamicNodes[candidateKeyToRemove]);
                    instance._dynamicNodes[candidateKeyToRemove].parentNode.removeChild(instance._dynamicNodes[candidateKeyToRemove]);
                }
                return true;
            } else if (instance._keyedNodes[candidateKeyToRemove] !== undefined) {
                console.log('remop')
                instance._keyedNodes[candidateKeyToRemove].parentNode.removeChild(instance._keyedNodes[candidateKeyToRemove]);
                return true;
            }
        }
    }
});