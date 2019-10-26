const {directive} = require('../index');
const {COMPONENT_DYNAMIC_INSTANCE} = require('../../constants');
const ATTR_DATA_KEY = 'data-key';
const ATTR_D_KEY = 'd-key';

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
        //console.log('---<',$target)
        if (propName === ATTR_D_KEY || propName === ATTR_DATA_KEY) {
            props.key = propValue;
        }
    },

    onComponentDOMElementCreate(instance, $target, directiveValue) {
        $target.dataset.key = directiveValue;
        instance._keyedNodes[directiveValue] = $target;
    },

    onComponentDOMElementUpdate(instance, $target, directiveValue) {
        //$target.dataset.key = directiveValue;
        //instance._keyedNodes[directiveValue] = $target;
        //console.log('update', directiveValue)
        //instance.props.key = directiveValue;

        /*if(instance._keyedNodes[directiveValue].__dozComponentInstance) {
            console.log(instance._keyedNodes[directiveValue].__dozComponentInstance)
        }*/
    },

    onAppDynamicInstanceCreate(instance, dynamicInstance, item) {
        if (item.node.dataset.key) {
            instance._dynamicNodes[item.node.dataset.key] = dynamicInstance._rootElement.parentNode;
        }
    },

    onAppComponentRenderOverwrite(instance, changes, next, prev) {
        let candidateKeyToRemove;
        let thereIsDelete = false;
        let noCmpKeyRemoved = false;
        //console.log(changes);
        //return true

        let mustBeReturn;

        changes.forEach((change) => {

            if (change.previousValue && typeof change.previousValue === 'object' && Object.keys(change.previousValue).length && change.target && typeof change.target === 'object') {
                console.log(change)
                mustBeReturn = true;
                /*let oK = Object.keys(change.newValue);
                if (oK.includes('key')) {
                    console.log(change.newValue)
                }*/
            }

            /*if (change.previousValue && typeof change.previousValue === 'object' && Object.keys(change.previousValue).length) {
                if (change.target && typeof change.target === 'object') {
                    let oK = Object.keys(change.target);
                    if (oK.length && Array.isArray(change.target[oK])) {
                        if (change.target[oK].length
                            && change.target[oK][0]
                            && typeof change.target[oK][0] === 'object'
                            && change.target[oK][0].key !== undefined) {

                            // Just if deleted keys
                            if (change.previousValue.length > change.newValue.length) {
                                //console.log('ci sono key, posso fare qualcosa', typeof change.previousValue);
                                let prevKeys = change.previousValue.map(item => item.key);
                                let newKeys = change.newValue.map(item => item.key);

                                let doRemoveKeys = prevKeys.filter(function(n) {
                                    return newKeys.indexOf(n) === -1;
                                });

                                noCmpKeyRemoved = !!doRemoveKeys.length;

                                doRemoveKeys.forEach(item => {
                                    if(instance._keyedNodes[item])
                                        instance._keyedNodes[item].parentNode.removeChild(instance._keyedNodes[item])
                                });
                            }
                        }
                    }
                }
            }

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
            }*/
        });

        if (mustBeReturn)
            return true;

        /*
        if (noCmpKeyRemoved)
            return true;

        //console.log(thereIsDelete, candidateKeyToRemove)
        //console.log(instance._keyedNodes, candidateKeyToRemove)
        if (!thereIsDelete)
            candidateKeyToRemove = undefined;

        if (candidateKeyToRemove !== undefined) {
            if (instance._dynamicNodes[candidateKeyToRemove] !== undefined) {
                if (instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE]) {
                    instance._dynamicNodes[candidateKeyToRemove][COMPONENT_DYNAMIC_INSTANCE].destroy();
                } else {
                    //console.log(instance._dynamicNodes[candidateKeyToRemove]);
                    instance._dynamicNodes[candidateKeyToRemove].parentNode.removeChild(instance._dynamicNodes[candidateKeyToRemove]);
                }
                return true;
            } else if (instance._keyedNodes[candidateKeyToRemove] !== undefined) {
                instance._keyedNodes[candidateKeyToRemove].parentNode.removeChild(instance._keyedNodes[candidateKeyToRemove]);
                return true;
            }
        }*/
    }
});