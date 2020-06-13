# Global API

### Doz.component( tag, definition )

- **Since**: 0.0.19
- **Arguments**:
    - `string` tag
    - `function` | `object` definition
- **Details**: Register a global component.
- **Usage**:
  ``` js
  // register with object configuration
  Doz.component('my-component', {
    /* ... */
  })
  ```

### Doz.define( tag, definition )

- **Since**: 1.5.0
- **Arguments**:
    - `string` tag
    - `function` | `object` definition
- **Details**:
    This is an alias of `component` for don't confuse you with Component subclass.
- **Usage**:
    ``` js
    // register with class declaration
    Doz.define('my-component', class extends Doz.Component {
        /* ... */
    })
    ```

### Doz.Component( config )

- **Since**: 1.5.0
- **Arguments**:
    - `object` config
- **Details**:
    This class it's used by Doz internally to creating component instances.
    If you want use ES6 class to define a component you must extend this class.
- **Usage**:
    ``` js
    Doz.define('my-component', class extends Doz.Component {

        constructor(o) {
            super(o);
            this.props = {
                name: 'Hello'
            };
        }

        template(h) {
            return h`
                <div>${this.props.name}</div>
            `
        }

    })
    ```

### Doz.h( template )

- **Since**: 1.5.0
- **Arguments**:
    - `string` template
- **Details**: This helper improves the virtual dom performance.
- **Usage**:
    ``` js
    Doz.define('my-component', class extends Doz.Component {

        constructor(o) {
            super(o);
            this.props = {
              name: 'Doz'
            };
        }

        template(h) {
            return h`
              <div>Hello ${this.props.name}</div>
            `
        }

    })
    ```

### Doz.mixin( mixin )

- **Since**: 1.5.0
- **Arguments**:
    - `object` | `object[]` mixin
- **Details**: Add external functions to global components. Mixin **don't overwrite** existing functions, since 1.7.0 a warning message will be showed into console.
- **Usage**:
    ``` js
    const someFunctions = {
       myFunc1() {},
       myFunc2() {},
       /* ... */
    };

    Doz.mixin(someFunctions);

    Doz.component('my-component', {

        template(h) {
            return h`<div>${this.myFunc1('Hello')}</div>`
        },

        onMount() {
            this.myFunc2();
        }

    })
    ```

### Doz.use( plugin )

- **Since**: 1.6.0
- **Arguments**:
    - `function` plugin
- **Details**: Add a plugin to Doz.
- **Usage**:
    ``` js
    const myPlugin = function(Doz, app, options) {
        //Doz, the Doz framework
        //app, app instance
        //options, an object
    }

    Doz.use(myPlugin);
    ```

### Doz.compile( string )

- **Since**: 1.6.0
- **Arguments**:
    - `string` string
- **Details**: Transforms HTML strings to tree object.
- **Usage**:
    ``` js
    Doz.compile(`
        <button onclick="console.log($this)">Click me</button>
    `);

    /*
        {
            type: 'BUTTON',
            children: ['Click me'],
            props: {
                onclick: 'console.log($this)'
            },
            isSVG: false
        }
    */

    ```
  
### Doz.defineWebComponent( tag, component, [observedAttributes] )

- **Since**: 2.5.0
- **Arguments**:
    - `tag` string
    - `component` function, object
    - `observedAttributes` array of attributes to observe
- **Details**: Create WebComponent.
- **Usage**:
    ``` js
    Doz.defineWebComponent('dwc-my-cmp', class extends Component {
        //....//
    }, ['foo', 'bar']);
    ```
    In your HTML page
    ```html
    <!-- Load Doz library -->
    <dwc-my-cmp foo="lorem" bar="ipsum"></dwc-my-cmp> 
    <!-- Load Doz component -->
    ```
  
### Doz.defineWebComponentFromGlobal( tag, globalTag, [observedAttributes] )

- **Since**: 3.3.0
- **Arguments**:
    - `tag` string
    - `globalTag` string
    - `observedAttributes` array of attributes to observe
- **Details**: Create WebComponent.
- **Usage**:
    ``` js
    Doz.defineWebComponentFromGlobal('dwc-my-cmp', 'my-cmp', ['foo', 'bar']);
    ```
    In your HTML page
    ```html
    <!-- Load Doz library -->
    <dwc-my-cmp foo="lorem" bar="ipsum"></dwc-my-cmp> 
    <!-- Load Doz component -->
    ```

### Doz.version()

- **Since**: 1.0.1
- **Details**: Retrieve Doz version.
- **Usage**:
    ``` js
    console.log(Doz.version()) // 1.5.0;
    ```