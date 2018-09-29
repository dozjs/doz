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
     */
    style?: object

    /**
     * An unique store name to expose the props with other components of the app.
     */
    store?: string
}