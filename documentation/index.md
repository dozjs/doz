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
    - [Handlers](#handlers)
        - [Passing arguments](#passing-arguments)
    - [Emitter](#emitter)
    - [Events](#events)
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
| `action` | object | This object contains all view actions. More info on [actions](#actions) | no | no |
| `alias` | string | A name that identify the children component. More info on [directives](#directives) | no | yes |
| `children` | object | An object that contains all children components | no | no |
| `destroy` | function | Destroy component and his children | no | no |
| `each` | function | This method serves to iterate parts of the template. More info on [loops](#loops) | no | no |
| `emit` | function | This method call a callback given an event name. More info on [emitter](#emitter) | no | no |
| `getComponent` | function | Get child component by alias | no | yes |
| `getComponentById` | function | Get component by id | no | no |
| `getStore` | function | Get store by name | no | no |
| `id` | string | A unique name that identify the component inside the view. More info on [directives](#directives) | no | yes |
| `mount` | function | This method can mount a new component as child. More info on [mount](#async-mount) | no | no |
| `onBeforeCreate`| function | This method is called before that component instance is created. More info on [events](#events) | no | no |
| `onBeforeDestroy`| function | This method is called before that component instance is destroyed. More info on [events](#events) | no | no |
| `onBeforeUpdate`| function | This method is called before that component instance is updated. More info on [events](#events) | no | no |
| `onCreate`| function | This method is called after that component instance is created. More info on [events](#events) | no | no |
| `onDestroy`| function | This method is called after that component instance is destroyed. More info on [events](#events) | no | no |
| `onRender`| function | This method is called after that component instance is mounted. More info on [events](#events) | no | no |
| `onUpdate`| function | This method is called after that component instance is updated. More info on [events](#events) | no | no |
| `parent` | object | The parent object | no | no |
| `props` | object | This object can contains all component props | no | yes |
| `ref` | object | An object that contains all references to HTML elements that have the directive "d-ref" | no | no |
| `render` | function | This method is called after changes detected, then updates the component part | no | no |
| `store` | string | An unique store name to expose the props with other components of the view | no | yes |
| `tag` | string | Component tag name | no | no |
| `template` | function | This method must be return the component template literals | yes | yes |
| `view` | object | The view object | no | no |

### Handlers
All HTML element of a component accepts standard events. It's possible also passing a component method or [actions](#actions).

```javascript

import Doz from 'doz'

Doz.component('my-button', {
    template() {
        return `
            <button onclick="this.clickme()">Click me!</button>
        `
    },
    clickme(e) {
        alert(e)
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome my app:</h1>
        <my-button></my-button>
    `
});
```

[Result](https://jsfiddle.net/fabioricali/v0ejbsLs/)

#### Passing arguments
The method passed to event is transformed by Doz (in reality it's a string) so the arguments are automatically casted.
`this` is a special placeholder that identify current instance.

```javascript

import Doz from 'doz'

Doz.component('my-button', {
    template() {
        return `
            <button onclick="this.clickme('hello', 'world', this)">Click me!</button>
        `
    },
    clickme(myArg, otherArg, me, e) {
        alert(myArg + ' ' + otherArg);
        alert(e);
        console.log(me);
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome my app:</h1>
        <my-button></my-button>
    `
});
```

[Result](https://jsfiddle.net/fabioricali/1wj852pd/)

### Emitter
Any component can emit a custom event. See also [component directives](#doz-component).

```javascript

import Doz from 'doz'

Doz.component('salutation-card', {
    template() {
        return `<caller-o d:on-mycallback="aCallback"></caller-o>`
    },
    aCallback: function(arg) {
        alert('callback is called: ' + arg);
    }
});

Doz.component('caller-o', {
    template() {
        return `<button onclick="this.emit('mycallback', 'hello world')">Callback</button>`
    }
});

new Doz({
    root: '#app',
    template: `
        <salutation-card></salutation-card>
    `
});
```

[Result](https://jsfiddle.net/fabioricali/2spdq60k/)

### Events
In order all events:
- `onBeforeCreate`: called before that instance is created.
- `onCreate`: called after that instance is created.
- `onRender`: called after that instance is mounted on DOM.
- `onBeforeUpdate`: called before that instance is updated.
- `onUpdate`: called after that instance is updated.
- `onBeforeDestroy`: called before that instance is destroyed.
- `onDestroy`: called after that instance is destroyed.

Any event with prefix "onBefore" if returns `false` the next event will not called.

```javascript
//..
    onBeforeUpdate() {
        if (this.props.counter >= 10) return false;
    },
    onUpdate() {
        console.log('update', this.props.counter);
    },
//..
```

A complete example

```javascript

import Doz from 'doz'

Doz.component('hello-world', {
    props: {
        salutation: 'Hello World'
    },
    template() {
        return `
            <h2>${this.props.salutation}</h2>
        `
    },
    onBeforeCreate() {
        console.log('before create');
    },
    onCreate() {
        console.log('create');
    },
    onRender() {
        console.log('render');
        setTimeout(()=> this.props.salutation = 'Ciao Mondo', 1000);
    },
    onBeforeUpdate() {
        console.log('before update', this.props.salutation);
    },
    onUpdate() {
        console.log('update', this.props.salutation);
        setTimeout(()=> this.destroy(), 1000)
    },
    onBeforeDestroy() {
        console.log('before destroy');
    },
    onDestroy() {
        console.log('destroy');
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

[Result](https://jsfiddle.net/fabioricali/77o4e7nL/)