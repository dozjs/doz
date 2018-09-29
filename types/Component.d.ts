export default class Component {
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