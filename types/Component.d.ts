type Doz = {};

interface ConfigClass {
    tag: string
    cmp?: object
    root: HTMLElement
    app: Doz
    props: object
    dProps: object
    parentCmp: Component
}

interface ConfigComponent {
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

export default class Component {

    /**
     * This object contains all app actions.
     */
    action: object;

    /**
     * The app instance.
     */
    app: Doz;

    /**
     * The app HTMLElement.
     */
    appRoot: HTMLElement;

    /**
     * The parent Component instance.
     */
    parent: Component;

    /**
     * This object contains all component props.
     */
    props: object;

    /**
     * An array that contains all children components as string.
     */
    rawChildren: Array<string>;

    /**
     * Component tag name.
     */
    ref: string;

    /**
     * If you use ES6 pattern, you must add all component options inside this object. This options is available only if extend Component.
     */
    config: ConfigComponent;

    /**
     *
     * @param {ConfigClass} cfg
     */
    constructor(cfg: ConfigClass)

    /**
     * This method serves to iterate parts of the template.
     * @param {object} obj
     * @param {(item: any, i: number) => string} func
     * @param {boolean} safe
     * @returns {string}
     */
    each(obj: object, func: (item: any, i: number)=> string, safe?:boolean): string

    /**
     * This method call a callback given an event name.
     * @param {string} name
     * @param args
     */
    emit(name: string, ...args: any[])

    /**
     * Returns HTML element of component
     * @returns {HTMLElement}
     */
    getHTMLElement(): HTMLElement

    /**
     * This method enable encoding of props into HTML entities before they are called.
     */
    beginSafeRender(): void

    /**
     * This method disable encoding of props into HTML entities before they are called.
     */
    endSafeRender(): void

    /**
     * This method generate inline style from an object inside the template.
     * @param {object} obj
     * @returns {string}
     */
    toStyle(obj: object): string

    /**
     * Get store by name.
     * @param {string} name
     * @returns {object}
     */
    getStore(name: string): object

    /**
     * Get component instance by id.
     * @param {string} id
     * @returns {Component}
     * @alias getCmp
     */
    getComponentById(id: string): Component

    /**
     * This method must be return the component template literals.
     * @returns {string}
     */
    template(): string

    /**
     * This method is called after changes detected, then updates the component part.
     */
    render():void

    /**
     * This method can mount a new component as child.
     * @param {string} template
     * @returns {Component}
     */
    mount(template: string): Component

    /**
     * This method unmount a component from DOM.
     * @returns {boolean | Component | void}
     */
    unmount(): boolean | Component | void

    /**
     * Destroy component and his children.
     */
    destroy(): void
}