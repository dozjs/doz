import ComponentClass from './Component'

export = Doz;
export as namespace Doz;

declare namespace Doz {

    class Component extends ComponentClass{}

    function component(name: string, options: object): void

    function define(name: string, options: object): void

    function use(plugin: Function, options: object): void

    function mixin(methods: object): void

    function h(template: string): string

    function compile(template: string): object

    interface collection {
        removeAll()
    }

    const version: string
}
