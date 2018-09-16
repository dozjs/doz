# Doz instance

## new Doz( opt )

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
- **Description**: This method draws app in the root.

#### doz.getComponentById( id )

- **Since**: 0.0.19
- **Type**: `function`
- **Returns** doz
- **Description**: This method draws app in the root.

#### doz.getStore( store )

- **Since**: 1.6.0
- **Type**: `function`
- **Returns** doz
- **Description**: This method draws app in the root.

#### doz.on( event, callback )

- **Since**: 1.6.0
- **Type**: `function`
- **Returns** doz
- **Description**: This method draws app in the root.