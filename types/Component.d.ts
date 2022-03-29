import ConfigComponent from './config-component'

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

export class Component {

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
     * This object contains all things shared between components.
     */
    shared: object;

    /**
     * An array that contains all children components as string.
     */
    rawChildren: Array<string>;

    /**
     * Component tag name.
     */
    ref: string;

    /**
     * An object that contains all children components.
     */
    children: object;

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
     * This method recreates the props object.
     * @param {object} obj
     */
    loadProps(obj: object): void

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
     * Get ext component instance by id.
     * @param {string} id
     * @returns {Component}
     */
    getWebComponentById(id: string): Component

    /**
     * Get ext component instance by tag.
     * @param {string} tag
     * @returns {Component}
     */
    getWebComponentByTag(tag: string): Component

    /**
     * This method must be return the component template literals.
     * @returns {string}
     */
    template(h: any): string

    /**
     * This method is called after changes detected, then updates the component part.
     */
    render():void

    /**
     * After calling this method, the component will be not updated if props change
     */
    renderPause():void

    /**
     * This method disable renderPause status and call render
     */
    renderResume():void

    /**
     * Check if render is in pause
     */
    isRenderPause: boolean;

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

    /**
     * After calling this method, the component will be not updated if props change
     */
    prepareCommit():void

    /**
     * This method disable prepareCommit status and call render with a delay
     */
    commit():void

    /**
     * This method sets props using prepareCommit and commit.
     * @param {object} obj
     */
    setProps(obj: object): void

    /**
     * This method sets props using delay and without prepareCommit and commit.
     * @param {object} obj
     */
    setPropsAsync(obj: object): void

    /**
     * This method allows you to mount the component after that onWaitMount is called, this method is available only id waitMount is set to true.
     * @param {object} obj
     */
    runMount(obj: object): void
}