import manipulate from "./manipulate.js";
function iterate(instance, props) {
    let keys = Object.keys(props);
    for (let i = 0, l = keys.length; i < l; i++) {
        let property = keys[i];
        if (props[property] instanceof Object && props[property] !== null) {
            iterate(instance, props[property]);
        }
        else {
            props[property] = manipulate(instance, props[property], property, false, true);
        }
    }
}
function propsInit(instance) {
    // I don't know if it is a good idea this assignment
    // I did this for props defined outside class... so they are not defined in the constructor...
    Object.assign(instance.props, instance._rawProps);
    iterate(instance, instance._rawProps);
}

/*function propsInit(instance) {
    (function iterate(props) {
        let keys = Object.keys(props);
        for (let i = 0, l = keys.length; i < l; i++) {
            let property = keys[i];
            if (props[property] instanceof Object && props[property] !== null) {
                iterate(props[property]);
            }
            else {
                props[property] = manipulate(instance, props[property], property, false, true);
            }
        }
    })(instance._rawProps);
}*/
export default propsInit;
