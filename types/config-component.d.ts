export default interface ConfigComponent {
    /**
     * A name that identify the children component.
     */
    alias?: string

    /**
     * If true, create the child components.
     */
    autoCreateChildren?: boolean

    /**
     * An object that contains local components.
     */
    components?: object

    /**
     * A unique name that identify the component inside the app.
     */
    id?: string

    /**
     * Mixin
     */
    mixin?: object | Array<object>

    /**
     * An object that contains component style in object literal.
     * @deprecated since 1.8.0 in favor of tag style inside template function
     */
    style?: object

    /**
     * An unique store name to expose the props with other components of the app.
     */
    store?: string

    /**
     * An object array or boolean that defines props propagation to the child components.
     */
    propsPropagation?: object|boolean

    /**
     * An object for detect props changes.
     */
    propsListener?: object

    /**
     * An object for detect props changes. Async version.
     */
    propsListenerAsync?: object

    /**
     * An object that defines listeners for computing operation over props.
     */
    propsConvert?: object

    /**
     * An object that defines listeners for computing operation (with cache) over props.
     */
    propsComputed?: object

    /**
     * An object that defines the type for each prop.
     */
    propsType?: object

    /**
     * If true, the manipulation operation will be performed on the read data. Default: false.
     */
    propsComputedOnFly?: boolean

    /**
     * A delay in MS for props update. The `onBeforeUpdate` event will be called without delay. Default: 0.
     */
    delayUpdate?: number

    /**
     * This object allow to sharing things between components.
     */
    shared?: object;

    /**
     * If true, the component will be mounted after the call of runMount(). Default: false.
     */
    waitMount?: object;
}