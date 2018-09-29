import ComponentClass from './Component'
import ConfigComponent from './config-component'

export = Doz;
export as namespace Doz;

declare namespace Doz {

    class Component extends ComponentClass{}

    /**
     * Register a global component.
     * @param {string} name
     * @param {ConfigComponent} options
     * @alias define
     */
    function component(name: string, options: ConfigComponent | object): void

    /**
     * This is an alias of component for don't confuse you with Component subclass.
     * @param {string} name
     * @param {ConfigComponent} options
     */
    function define(name: string, options: ConfigComponent | object): void

    /**
     * Add a plugin to Doz.
     * @param {Function} plugin
     * @param {object} options
     */
    function use(plugin: Function, options: object): void

    /**
     * Add external functions to global components.
     * @param {object} methods
     */
    function mixin(methods: object): void

    /**
     * This helper improve the virtual dom performance.
     * @param {string} template
     * @returns {string}
     */
    function h(template: string): string

    /**
     * Transforms HTML string to tree object.
     * @param {string} template
     * @returns {object}
     */
    function compile(template: string): object

    /**
     * Collection
     */
    interface collection {
        removeAll()
    }

    /**
     * Retrieve Doz version.
     */
    const version: string
}
