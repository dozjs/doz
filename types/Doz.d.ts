import ConfigComponent from "./config-component";

export * from './Component'

/**
 * Register a global component.
 * @param {string} name
 * @param {ConfigComponent} options
 * @alias define
 */
export function component(name: string, options: ConfigComponent | object): void

/**
 * This is an alias of component for don't confuse you with Component subclass.
 * @param {string} name
 * @param {ConfigComponent} options
 */
export function define(name: string, options: ConfigComponent | object): void

/**
 * Add a plugin to Doz.
 * @param {Function} plugin
 * @param {object} options
 */
export function use(plugin: Function, options?: object): void

/**
 * Create WebComponent.
 * @param {string} tag
 * @param {object} component
 * @param {Array<string>} observedAttributes
 * @param {Array<string>} exposedMethods
 */
export function defineWebComponent(tag: string, component?: ConfigComponent | object | Function, observedAttributes?: Array<string>, exposedMethods?: Array<string>): void

/**
 * Create WebComponent from global Doz component.
 * @param {string} tag
 * @param {object} globalTag
 * @param {Array<string>} observedAttributes
 * @param {Array<string>} exposedMethods
 */
export function defineWebComponentFromGlobal(tag: string, globalTag:string, observedAttributes?: Array<string>, exposedMethods?: Array<string>): void

/**
 * Add external functions to global components.
 * @param {object} methods
 */
export function mixin(methods: object): void

/**
 * This helper improve the virtual dom performance.
 * @param {string} template
 * @returns {string}
 */
export function h(template: string): string

/**
 * Transforms HTML string to tree object.
 * @param {string} template
 * @returns {object}
 */
export function compile(template: string): object

/**
 * Creates app by a main component.
 * @param {string} root
 * @param {object} component
 * @param {object} options
 * @returns {object}
 */
export function appCreate(root: string, component: object, options?: object): object

/**
 * Tag decorator.
 * @param {string} name
 */
export function tag(name: string): void

/**
 * Create component instance.
 * @param {object} cfg
 */
export function createInstance(cfg: object): void

/**
 * Collection
 */
export interface collection {
    removeAll()
}

/**
 * Retrieve Doz version.
 */
export const version: string;