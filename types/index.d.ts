import ComponentClass from './Component'
import ConfigComponent from './config-component'

export = Doz;
export as namespace Doz;

declare namespace Doz {

    class Component extends ComponentClass{}

    /**
     *
     * @param {string} name
     * @param {ConfigComponent} options
     * @alias define
     */
    function component(name: string, options: ConfigComponent): void

    function define(name: string, options: ConfigComponent): void

    function use(plugin: Function, options: object): void

    function mixin(methods: object): void

    function h(template: string): string

    function compile(template: string): object

    interface collection {
        removeAll()
    }

    const version: string
}
