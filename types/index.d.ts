export = Doz;
export as namespace Doz;

declare namespace Doz {
    class Component {
        /**
         * This method serves to iterate parts of the template.
         * @param {object} obj
         * @param {(item: any, i: number) => string} func
         * @param {boolean} safe
         * @returns {string}
         */
        each(obj: object, func: (item: any, i: number)=> string, safe?:boolean): string

        /**
         * This method call a callback given an event name
         * @param {string} name
         * @param args
         */
        emit(name: string, ...args: any[])
    }

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
