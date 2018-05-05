<div align="center">
<br/><br/>
<img width="100" src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz.png" title="doz"/>
<br/>
A JavaScript framework for building UI, almost like writing in VanillaJS.
</div>

# Documentation
Below some basic concepts:

- [Component definition](#component-definition)
    - [Props](#props)
    - [Methods](#methods)
        - [Inherited](#inherited)
    - Handlers
    - Emitter
    - Events
    - Local component
    - Async mount
- View component
- Directives
    - HTML element
    - DOZ component
- Loops,
- Actions
- Develop and production

## Component definition
The method `component` defines an component globally that can be added to any view of the project.
The tag name must be according to the [W3C specs](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

```javascript

import Doz from 'doz'

Doz.component('hello-world', {
    template() {
        return `
            <h2>Hello World</h2>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome my app:</h1>
        <hello-world></hello-world>
    `
});
```

[Result](https://jsfiddle.net/fabioricali/ut18kyy1/)

### Props
All props are stored into `props` property of the component and they are accessible through a proxy that detect changes. When there are changes Doz update only the node that containing the updated prop.
Doz uses [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to build the component UI then the props are injected inside the string.

```javascript

import Doz from 'doz'

Doz.component('my-clock', {
    props: {
        time: '--:--:--'
    },
    template() {
        return `
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    },
    onRender() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome my app:</h1>
        <my-clock title="it's"></my-clock>
    `
});
```

[Result](https://jsfiddle.net/fabioricali/8qp9co1o/)

### Methods
The methods are defined inside a single object where there are also props and events.
Why this choice? Because during development it's essential to have an exact reference of `this`.

```javascript

import Doz from 'doz'

Doz.component('my-component', {
    props: {
        title: 'Hello World'
    },
    template() {
        return `
            <h1>${this.props.title}</h2>
        `
    },
    yourMethod() {
        // do something
    },
    anotherMethod() {
        this.yourMethod();
    }
});

```

#### Inherited
When a component is defined this inheritance some methods and properties:

| Name | Type | Description | Required | Editable |
| ---- | ---- | ----------- | -------- | -------- |
| `template` | function | This method must be return the component template literals | yes | yes |
| `props` | object | This object can contains all component props | no | yes |
| `store` | string | An unique store name to expose the props with other components of the view | no | yes |
| `getStore` | function | Get store by name | no | no |
| `id` | string | A unique name that identify the component inside the view. More info on [directives](#directives) | no | yes |
| `getComponentById` | function | Get component by id | no | no |
| `alias` | string | A name that identify the children component. More info on [directives](#directives) | no | yes |
| `view` | object | The view object | no | no |
| `parent` | object | The parent object | no | no |
| `children` | object | An object that contains all children components | no | no |
| `ref` | object | An object that contains all references to HTML elements that have the directive "d-ref" | no | no |
| `tag` | string | Component tag name | no | no |
| `each` | function | This method serves to iterate parts of the template. More info on [loops](#loops) | no | no |
| `emit` | function | This method call a callback given an event name. More info on [emitter](#emitter) | no | no |
| `action` | object | This object contains all view actions. More info on [actions](#actions) | no | no |
| `render` | function | This method is called after changes detected, then updates the component part | no | no |
| `mount` | function | This method can mount a new component as child | no | no |
| `destroy` | function | Destroy component and his children | no | no |
| `onBeforeCreate`| function | This method is called before that component instance is created. More info on [events](#events) | no | no |
| `onCreate`| function | This method is called after that component instance is created. More info on [events](#events) | no | no |
| `onRender`| function | This method is called after that component instance is mounted. More info on [events](#events) | no | no |
| `onBeforeUpdate`| function | This method is called before that component instance is updated. More info on [events](#events) | no | no |
| `onUpdate`| function | This method is called after that component instance is updated. More info on [events](#events) | no | no |
| `onBeforeDestroy`| function | This method is called before that component instance is destroyed. More info on [events](#events) | no | no |
| `onDestroy`| function | This method is called after that component instance is destroyed. More info on [events](#events) | no | no |