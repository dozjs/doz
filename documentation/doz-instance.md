# Doz instance

## new Doz( opt )

Basic usage

```js
new Doz({
    root: '#app',
    template(h) {
        return h`
            <div>
                <h1>My App</h1>
                <a-component></a-component>
            </div>
        `
    }
});
```

### Options

#### actions

- **Since**: 0.0.19
- **Type**: `object`
- **Default**: {}
- **Description**:
    The actions allows to better organize the logic of
    the various components in the app, and they are global so can be called
    in all components..

#### autoDraw

- **Since**: 1.6.0
- **Type**: `boolean`
- **Default**: true
- **Description**: If is set to false, l'app will be not rendered.

#### root

- **Since**: 0.0.19
- **Type**: `HTMLElement`
- **Default**: null
- **Description**: HTMLElement where app will be rendered.

#### template

- **Since**: 0.0.19
- **Type**: `string` | `function`
- **Default**: undefined
- **Description**: Function or string that contains the template.

### shared

- **Since**: 1.8.0
- **Type**: `object`
- **Default**: undefined
- **Description**: This object allow to sharing things between components.


### Methods

#### doz.draw()

- **Since**: 1.6.0
- **Type**: `function`
- **Returns** doz
- **Description**: This method draws app in the root.

#### doz.emit( event, ...args )

- **Since**: 1.6.0
- **Type**: `function`
- **Arguments**:
    - `string` event
    - `any` args
- **Returns** doz
- **Description**: Emits an event.

#### doz.getComponentById( id )

- **Since**: 0.0.19
- **Type**: `function`
- **Arguments**:
    - `string` id
- **Returns** doz
- **Description**: Retrieve a component instance by id.

#### doz.getStore( store )

- **Since**: 1.6.0
- **Type**: `function`
- **Arguments**:
    - `string` store
- **Returns** doz
- **Description**: Retrieve a props store by name.

#### doz.on( event, callback )

- **Since**: 1.6.0
- **Type**: `function`
- **Arguments**:
    - `string` event
    - `function` callback
- **Returns** doz
- **Description**: Adds event listener to Doz app instance.


### Events

#### "draw" (next, prev, component)

- **Since**: 1.6.0
- **Arguments**:
    - `object` next Object that contains next virtual DOM
    - `object` prev Object that contains previous virtual DOM
    - `Component` component Component instance
- **Description**: Triggered every app render.

#### "ready"

- **Since**: 1.6.0
- **Description**: Triggered when all initial component are mounted on the DOM.