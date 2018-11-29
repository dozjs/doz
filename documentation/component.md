# Component

A component can be created in two ways:

- Plain object:
    ```js
    {
        props: {
            something: 'how are you?'
        },
        template(h) {
            return h`
                <div>
                    Hello Doz! ${this.props.something}
                </div>
            `
        }
    }
    ```

- ES6 class
    ```js
    class extends Doz.Component{

        constructor(o) {
            super(o);

            this.props = {
                something: 'how are you?'
            };
        }

        template(h) {
            return h`
                <div>
                    Hello Doz! ${this.props.something}
                </div>
            `
        }
    }
    ```

> Doz creates automatically component instance during parsing of template,
when it find a tag for example `<my-tag-component></my-tag-component>`,
Doz checks if this tag it's registered as component only in this case the
instance will be created. See [how define a component](https://github.com/dozjs/doz/blob/master/documentation/index.md#component-definition).

## Options

### alias

- **Since**: 0.0.19
- **Type**: `string`
- **Default**: ''
- **Description**: A name that identify the children component. More info on [directives](https://github.com/dozjs/doz/blob/master/documentation/index.md#directives).

### autoCreateChildren

- **Since**: 1.0.0
- **Type**: `boolean`
- **Default**: true
- **Description**: If true, create the child components.

### components

- **Since**: 1.1.0
- **Type**: `object`
- **Default**: {}
- **Description**: An object that contains local components.

### config

- **Since**: 1.5.0
- **Type**: `object`
- **Default**: undefined
- **Description**:
    If you use ES6 pattern, you must add
    all component options inside this object.
    This options is available only if extend Component.
    More info on [ES6 Class]([Mixins](https://github.com/dozjs/doz/blob/master/documentation/index.md#es6-class))

### id

- **Since**: 0.0.19
- **Type**: `string`
- **Default**: ''
- **Description**: A unique name that identify the component inside the app. More info on [directives](https://github.com/dozjs/doz/blob/master/documentation/index.md#directives).

### mixin

- **Since**: 1.5.0
- **Type**: `object` | `array`
- **Default**: []
- **Description**: More info on [Mixins](https://github.com/dozjs/doz/blob/master/documentation/index.md#mixins).

### style

- **Since**: 1.4.0
- **Type**: `object`
- **Default**: undefined
- **Description**: An object that contains component style in object literal. More info on [scoped style](https://github.com/dozjs/doz/blob/master/documentation/index.md#scoped-style).
- **Deprecated** since 1.8.0 in favor of tag style inside template function.

### store

- **Since**: 0.0.19
- **Type**: `string`
- **Default**: ''
- **Description**: An unique store name to expose the props with other components of the app.

### propsListener

- **Since**: 1.8.0
- **Type**: `object`
- **Default**: undefined
- **Description**: Defines listeners to detect props changes.

### propsComputed

- **Since**: 1.8.0
- **Type**: `object`
- **Default**: undefined
- **Description**: Defines listeners for computing operation over props.


## Properties

### action

- **Since**: 0.0.19
- **Type**: `object`
- **Description**: This object contains all app actions. More info on [actions](https://github.com/dozjs/doz/blob/master/documentation/index.md#actions).

### app

- **Since**: 0.0.19
- **Type**: `Doz`
- **Description**: The app instance.

### appRoot

- **Since**: 1.4.0
- **Type**: `HTMLElement`
- **Description**: The app HTMLElement.

### parent

- **Since**: 0.0.19
- **Type**: `Component`
- **Description**: The parent Component instance.

### props

- **Since**: 0.0.19
- **Type**: `object`
- **Description**: This object contains all component props.

### rawChildren

- **Since**: 1.0.0
- **Type**: `array`
- **Description**: An array that contains all children components as string.

### ref

- **Since**: 0.0.19
- **Type**: `object`
- **Description**: An object that contains all references to HTML elements that have the directive "d-ref".

### tag

- **Since**: 0.0.19
- **Type**: `string`
- **Description**: Component tag name.

### shared

- **Since**: 1.8.0
- **Type**: `object`
- **Description**: An object that contains all things shared between components.


## Methods

### component.beginSafeRender()

- **Since**: 0.0.21
- **Type**: `function`
- **Description**: This method enable encoding of props into HTML entities before they are called.

### component.destroy()

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: Destroy component and his children.

### component.each( obj, func )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `object` obj
    - `function` func
- **Description**: This method serves to iterate parts of the template. More info on [loops](https://github.com/dozjs/doz/blob/master/documentation/index.md#loops).

### component.emit( event, ...args )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `string` event
    - `any` args
- **Description**: This method call a callback given an event name. More info on [emitter](https://github.com/dozjs/doz/blob/master/documentation/index.md#emitter).

### component.endSafeRender()

- **Since**: 0.0.21
- **Type**: `function`
- **Description**: This method disable encoding of props into HTML entities before they are called.

### component.getCmp( id )

- **Since**: 1.4.0
- **Type**: `function`
- **Arguments**:
    - `string` id
- **Alias**: `getComponentById`.

### component.getComponentById( id )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `string` id
- **Description**: Get component by id.

### component.getHTMLElement()

- **Since**: 1.2.0
- **Type**: `function`
- **Description**: Returns HTML element of component.

### component.getStore( store )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `string` store
- **Description**: Get store by name.

### component.mount( template )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `string` template
- **Description**: This method can mount a new component as child. More info on [mount](https://github.com/dozjs/doz/blob/master/documentation/index.md#async-mount).

### component.render()

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called after changes detected, then updates the component part.

### component.template()

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method must be return the component template literals.

### component.toStyle( obj )

- **Since**: 1.4.0
- **Type**: `function`
- **Arguments**:
    - `object` obj
- **Description**: This method generate inline style from an object inside the template. More info on [inline style](https://github.com/dozjs/doz/blob/master/documentation/index.md#inline-style).

### component.unmount()

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method unmount a component from DOM. More info on [unmount](https://github.com/dozjs/doz/blob/master/documentation/index.md#unmount).


## Lifecycle Hooks

### onAfterRender

- **Since**: 1.7.0
- **Type**: `function`
- **Description**: This method is called every time after that `render()` method has been called.

### onAppReady

- **Since**: 0.1.0
- **Type**: `function`
- **Description**: This method is called after that app is rendered that is all initial component are mounted on the DOM.

### onBeforeCreate

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called before that component instance is created.

### onBeforeDestroy

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called before that component instance is destroyed.

### onBeforeMount

- **Since**: 1.0.0
- **Type**: `function`
- **Description**: This method is called before that component instance is mounted.

### onBeforeUnmount

- **Since**: 1.0.0
- **Type**: `function`
- **Description**: This method is called before that component instance is unmounted.

### onBeforeUpdate ( [changes](#example-of-changes-object) )

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called before that component instance is updated.

### onConfigCreate

- **Since**: 1.5.0
- **Type**: `function`
- **Description**: This method is called after that component instance is created but only when `config` is set and with ES6 pattern. More info on [ES6 Class](https://github.com/dozjs/doz/blob/master/documentation/index.md#es6-class).

### onCreate

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called after that component instance is created.

### onDestroy

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called after that component instance is destroyed.

### onMount

- **Since**: 1.0.0
- **Type**: `function`
- **Description**: This method is called after that component instance is mounted.

### onMountAsync

- **Since**: 1.3.0
- **Type**: `function`
- **Description**: This method is called after that component instance is mounted but in async way.

### onRender

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called after that component instance is mounted.
- **Deprecated**: Use `onMount` instead.

### onUnmount

- **Since**: 1.0.0
- **Type**: `function`
- **Description**: This method is called after that component instance is unmounted.

### onUpdate ( [changes](#example-of-changes-object) )

- **Since**: 0.0.19
- **Type**: `function`
- **Description**: This method is called after that component instance is updated.

##### Example of changes object
```
{
    currentPath: "time"
    newValue: "22:59:47"
    previousValue: "22:59:46"
    property: "time"
    type: "update" // or delete
}
```

More info on [Lifecycle hooks](https://github.com/dozjs/doz/blob/master/documentation/index.md#lifecycle-hooks).