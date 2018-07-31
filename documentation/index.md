<div align="center">
<br/><br/>
<img width="100" src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz.png" title="doz"/>
<br/>
A JavaScript framework for building UI, almost like writing in VanillaJS.
</div>

# Documentation
Below some basic concepts:

- [Installation](#installation)
    - [Import library](#import-library)
- [Make an app](#make-an-app)
- [Component definition](#component-definition)
    - [Props](#props)
    - [Reusing components](#reusing-components)
    - [Methods](#methods)
        - [Inherited](#inherited)
    - [Handlers](#handlers)
        - [Inline logic](#inline-logic)
        - [Passing arguments](#passing-arguments)
    - [Emitter](#emitter)
    - [Lifecycle methods](#lifecycle-methods)
    - [Local component](#local-component)
    - [Mount](#mount)
    - [Directives](#directives)
        - [HTML element](#html-element)
            - [d-bind](#d-bind)
            - [d-ref](#d-ref)
        - [DOZ component](#doz-component)
            - [d:id](#did)
            - [d:store](#dstore)
            - [d:on](#don)
- [Conditional statements](#conditional-statements)
- [Loops](#loops)
- [Scoped style](#scoped-style)
- [Inline style](#inline-style)
- [Actions](#actions)
- [Component logic inside Doz constructor](#component-logic-inside-doz-constructor)
- [Develop and production](#develop-and-production)
    - [Hot module replacement and state preservation](#hot-module-replacement-and-state-preservation)
- [Write a component](#develop-and-production)

## Installation
```
npm install --save doz
```

### Import library
```javascript
//ES6
import Doz from 'doz'

//ES5
var Doz = require('doz');
```

## Make an app
An app is a main component that embed other components.

```javascript

import Doz from 'doz'

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <h2>Hello World</h2>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/rx9ps5s4/)

---

## Component definition
The method `component` defines an component globally that can be added to any other component of the project.
The tag name must be according to the [W3C specs](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).

```javascript
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
        <h1>Welcome to my app:</h1>
        <hello-world></hello-world>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/ut18kyy1/)

---

### Props
All props are stored into `props` (your component data) property of the component and they are accessible through a proxy that detect changes. When there are changes Doz update only the node that containing the updated prop.
Doz uses [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to build the component UI then the props are injected inside the string.

```javascript
Doz.component('my-clock', {
    props: {
        time: '--:--:--'
    },
    template() {
        return `
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    },
    onMount() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-clock title="it's"></my-clock>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/8qp9co1o/3)

---

### Reusing components
Doz applies Object.assign to `props` for a basic immutability.
Obviously `assign` method is not recursive then you need define `props` as function,
otherwise other instances of the same object will change the same data.

No problem for this scenario
```javascript
props: {
    value: 0
}
```

This scenario it's a problem
```javascript
props: {
    other: {
        value: 0
    }
}
```

You must convert to a function like so
```javascript
props: function(){
    return {
        other: {
            value: 0
        }
    }
}
```

### Methods
The methods are defined inside a single object where there are also props and events.
**Why this choice?** Because during development it's essential to have an exact reference of `this` context.

```javascript
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
When a component is defined it inherits some methods and properties:

| Name | Type | Description | Required | Editable | Since |
| ---- | ---- | ----------- | -------- | -------- | ----- |
| `action` | object | This object contains all app actions. More info on [actions](#actions) | no | no | |
| `alias` | string | A name that identify the children component. More info on [directives](#directives) | no | yes | |
| `app` | object | The app object | no | no | |
| `appRoot` | HTMLElement | The app HTMLElement | no | no | 1.4.0 |
| `autoCreateChildren` | boolean | If `true`, create the child components. Default: `true` | no | no | 1.0.0 |
| `children` | object | An object that contains all children components | no | no | |
| `components` | object | An object that contains local components | no | no | |
| `beginSafeRender` | function | This method enable encoding of props into HTML entities before they are called | no | no | |
| `destroy` | function | Destroy component and his children | no | no | |
| `each` | function | This method serves to iterate parts of the template. More info on [loops](#loops) | no | no | |
| `emit` | function | This method call a callback given an event name. More info on [emitter](#emitter) | no | no | |
| `endSafeRender` | function | This method disable encoding of props into HTML entities before they are called | no | no | |
| `getCmp` | function | Shorthand reference to `getComponentById` | no | no | |
| `getComponentById` | function | Get component by id | no | no | |
| `getHTMLElement` | function | Returns HTML element of component | no | no | 1.2.0 |
| `getStore` | function | Get store by name | no | no | |
| `id` | string | A unique name that identify the component inside the app. More info on [directives](#directives) | no | yes | |
| `mount` | function | This method can mount a new component as child. More info on [mount](#async-mount) | no | no | |
| `onAppReady`| function | This method is called after that app is rendered that is all initial component are mounted on the DOM | no | no | |
| `onBeforeCreate`| function | This method is called before that component instance is created. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onBeforeDestroy`| function | This method is called before that component instance is destroyed. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onBeforeMount`| function | This method is called before that component instance is mounted. More info on [Lifecycle methods](#lifecycle-methods) | no | no | 1.0.0 |
| `onBeforeUnmount`| function | This method is called before that component instance is unmounted. More info on [Lifecycle methods](#lifecycle-methods) | no | no | 1.0.0 |
| `onBeforeUpdate`| function | This method is called before that component instance is updated. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onCreate`| function | This method is called after that component instance is created. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onDestroy`| function | This method is called after that component instance is destroyed. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onMount`| function | This method is called after that component instance is mounted. More info on [Lifecycle methods](#lifecycle-methods) | no | no | 1.0.0 |
| `onMountAsync`| function | This method is called after that component instance is mounted but in async way. More info on [Lifecycle methods](#lifecycle-methods) | no | no | 1.3.0 |
| `onRender`| function | **[Deprecated]** This method is called after that component instance is mounted. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `onUnmount`| function | This method is called after that component instance is unmounted. More info on [Lifecycle methods](#lifecycle-methods) | no | no | 1.0.0 |
| `onUpdate`| function | This method is called after that component instance is updated. More info on [Lifecycle methods](#lifecycle-methods) | no | no | |
| `parent` | object | The parent object | no | no | |
| `props` | object | This object can contains all component props | no | yes | |
| `rawChildren` | array | An array that contains all children components as string | no | no | 1.0.0 |
| `ref` | object | An object that contains all references to HTML elements that have the directive "d-ref" | no | no | |
| `render` | function | This method is called after changes detected, then updates the component part | no | no | |
| `style` | object | An object that contains component style in object literal. More info on [scoped style](#scoped-style) | no | yes | 1.4.0 |
| `store` | string | An unique store name to expose the props with other components of the app | no | yes | |
| `tag` | string | Component tag name | no | no | |
| `template` | function | This method must be return the component template literals | yes | yes | |
| `toStyle` | function | This method generate inline style from an object inside the template. More info on [inline style](#inline-style) | no | no | 1.4.0 |
| `unmount` | function | This method unmount a component from DOM. More info on [unmount](#unmount) | no | no | |


### Handlers
All HTML element of a component accepts standard events. It's possible also passing a component method or [actions](#actions).

```javascript
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
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/v0ejbsLs/)

---

#### Inline logic
Since **1.3.2** version, Doz supports also inline logic. Normally `this` is reference of HTML element but in Doz it's every reference of component instance.

```javascript
Doz.component('my-button', {
    props: {
        count: 0
    },
    template() {
        return `
            <button onclick="this.props.count++">Click me!</button>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

#### Passing arguments
The method passed to event is transformed by Doz (in reality it's a string) so the arguments are automatically casted.
`this` is a special placeholder that identify current instance.

```javascript
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
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/1wj852pd/)

---

### Emitter
Any component can emit a custom event. See also [component directives](#doz-component).

```javascript
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

[FIDDLE](https://jsfiddle.net/fabioricali/2spdq60k/)

---

### Lifecycle methods
In order all hooks:
- `onBeforeCreate`: called before that instance is created.
- `onCreate`: called after that instance is created.
- `onBeforeMount`: called before that instance is mounted on DOM.
- `onMount`: called after that instance is mounted on DOM.
- `onMountAsync`: called after that instance is mounted on DOM.
- `onBeforeUpdate`: called before that instance is updated.
- `onUpdate`: called after that instance is updated.
- `onBeforeUnmount`: called before that instance is unmounted.
- `onUnmount`: called after that instance is unmounted.
- `onBeforeDestroy`: called before that instance is destroyed.
- `onDestroy`: called after that instance is destroyed.

Any event with prefix "onBefore" if returns `false` the next event will not called.

```javascript
//..
    onBeforeUpdate(changes) {
        console.log('before update', changes);
        if (this.props.counter >= 10) return false;
    },
    onUpdate(changes) {
        console.log('update', this.props.counter, changes);
    },
//..
```

Using the argument "changes" (only for `onBeforeUpdate` and `onUpdate`) you can know the changes of props object:
```
[
    {
        currentPath: "salutation"
        newValue: "Ciao Mondo"
        previousValue: "Hello World"
        property: "salutation"
        type: "update"
    }
]
```


A complete example

```javascript
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
    onBeforeMount() {
        console.log('before mount');
    },
    onMount() {
        console.log('mount');
        setTimeout(()=> this.props.salutation = 'Ciao Mondo', 1000);
    },
    onBeforeUpdate(changes) {
        console.log('before update', this.props.salutation, changes);
    },
    onUpdate(changes) {
        console.log('update', this.props.salutation, changes);
        setTimeout(()=> this.destroy(), 1000)
    },
    onBeforeUnmount() {
        console.log('before unmount');
    },
    onUnmount() {
        console.log('unmount');
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
        <h1>Welcome to my app:</h1>
        <hello-world></hello-world>
    `
});
```

[FIDDLE](https://jsfiddle.net/77o4e7nL/7/)

---

### Local component
As said previously, when define a component with `component` this will be global.
Doz also allows you to create local components:

```javascript
// First way
const helloWorld = {
    tag: 'hello-world',
    cfg: {
        template() {
            return `
                <h2>Hello World</h2>
            `
        }
    }
}

new Doz({
    components: [helloWorld],
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <hello-world></hello-world>
    `
});

// Second way
const helloWorld = {
    template() {
        return `
            <h2>Hello World</h2>
        `
    }
}

new Doz({
    components: {
        'hello-world': helloWorld
    },
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <hello-world></hello-world>
    `
});
```

Since 1.1.0 also components supports local components:

```javascript
// First
const hello = {
    template() {
        return `
            <span>Hello</span>
        `
    }
}

// Second
const world = {
    template() {
        return `
            <span>World</span>
        `
    }
}

// Together...
const HelloWorld = {
    components: {
        'hello-tag': hello,
        'world-tag': world
    },
    template() {
        return `
            <h2>
                <hello-tag></hello-tag>
                <world-tag></world-tag>
            </h2>
        `
    }
}

// App
new Doz({
    components: {
        'hello-world': HelloWorld
    },
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <hello-world></hello-world>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/Lkeonppk/)

---

### Mount
Doz component instance provide a method called `mount`,
this method allows you to "append" a new component inside another.

```javascript
Doz.component('hello-world', {
    template() {
        return `
            <h2>Hello World</h2>
        `
    }
});

Doz.component('my-wrapper', {
    template() {
        return `
            <div>
                <button onclick="this.mount('<hello-world></hello-world>')">Mount</button>
            </div>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-wrapper></my-wrapper>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/c4kaoc95/)

---

Mount component in a specific root inside a parent:

```javascript
Doz.component('hello-world', {
    template() {
        return `
            <h2>Hello World</h2>
        `
    }
});

Doz.component('my-wrapper', {
    template() {
        return `
            <div>
                <button onclick="this.append()">Mount</button>
                <div class="my-root" style="border: 1px solid #000"></div>
            </div>
        `
    },
    append() {
        this.mount('<hello-world></hello-world>', {selector: '.my-root'});
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-wrapper></my-wrapper>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/uLb9nw2d/)

---

### Unmount
You can also unmount a component.

```javascript
Doz.component('my-wrapper', {
    template() {
        return `
            <div>
                <h2>Hello World</h2>
                <button onclick="this.unmount()">Unmount</button>
            </div>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-wrapper></my-wrapper>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/3eb8v19r/2/)

### Directives
The directives are special attributes that are specified inside component tag.
There are two types:

#### HTML element
Directives that works only on HTML element.

##### d-bind
This directive bind an input element to a props:

```javascript
Doz.component('input-message', {
    template(){
        return `
            <div>
                <input type="text" d-bind="message" placeholder="${this.props.placeholder}"/>
                <p>${this.props.message}</p>
            </div>
        `
    },
    props: {
        message: ''
    }
});

new Doz({
    root: '#app',
    template: `
        <input-message placeholder="write a message"></input-message>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/2eeop7c5/)

---

##### d-ref
Sometimes it's necessary to have a easy reference to an HTML element in your component, this directive does it.

```javascript
Doz.component('my-button', {
    template() {
        return `
            <h2 d-ref="title">I'm a title</h2>
            <button onclick="this.clickme()">Get H2 ref!</button>
        `
    },
    clickme(e) {
        alert(this.ref.title);
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/2kk0L1r8/)

---

#### DOZ component
Directives that works only on component

##### d:alias
This attribute allows you to define an unique name that identify the component locally inside component parent.

```javascript
Doz.component('my-label', {
    template() {
        return `
            <label>I'm a label</label>
        `
    }
});

Doz.component('my-button', {
    template() {
        return `
            <button onclick="this.clickme()">Get component by alias!</button>
            <my-label d:alias="foo"></my-label>
        `
    },
    clickme(e) {
        alert(this.children.foo);
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

##### d:id
This attribute allows you to define an unique name that identify the component globally.

```javascript
Doz.component('my-label', {
    template() {
        return `
            <label>I'm a label</label>
        `
    }
});

Doz.component('my-button', {
    template() {
        return `
            <button onclick="this.clickme()">Get component by alias!</button>
        `
    },
    clickme(e) {
        alert(this.getComponentById('wowo'));
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-label d:id="wowo"></my-label>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/w3dmq43a/)

---

##### d:store
This attribute allows you to define an unique name that expose your component props globally.

```javascript
Doz.component('my-label', {
    props: {
        title: "I'm a label"
    },
    template() {
        return `
            <label>${this.props.title}</label>
        `
    }
});

Doz.component('my-button', {
    template() {
        return `
            <button onclick="this.clickme()">Update label</button>
        `
    },
    clickme(e) {
        this.getStore('wowo').title = 'Hello world!';
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-label d:store="wowo"></my-label>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/yo6xeoc2/)

---

##### d:on
This attribute allows you to define an event name.

```javascript
Doz.component('salutation-card', {
    template() {
        return `<div>${this.props.salutation} ${this.props.title} ${this.props.name} <caller-o d:on-mycallback="aCallback"></caller-o></div>`
    },
    aCallback: function(newSalutation) {
        this.props.salutation = newSalutation;
        alert(newSalutation);
    }
});

Doz.component('caller-o', {
    template() {
        return `<div>This component emit an event</div>`
    },
    onCreate() {
        setTimeout(()=>{
            this.emit('mycallback', 'Ciao');
        },1000);
    }
});

new Doz({
    root: '#app',
    template: `
        <salutation-card
            salutation="Hello"
            title="MR."
            name="Doz">
        </salutation-card>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/tkzv5obd/)

---

### Conditional statements
As said previously Doz use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```javascript
Doz.component('my-button', {
    props: {
        done: true
    },
    template() {
        return `
            <h2 style="color:${this.props.done ? 'red' : 'green' }">I'm a color</h2>
            <button onclick="this.clickme()">Toggle color</button>
        `
    },
    clickme(e) {
        this.props.done = !this.props.done;
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/sevzodnu/)

---

### Loops
Same situation like conditional statements but using the method `each` provided by component:

```javascript
Doz.component('my-list', {
    props: {
        colors: [
            {
                name: 'Red'
            },
            {
                name: 'Green'
            },
            {
                name: 'Orange'
            }
        ]
    },
    template() {
        return `
            <ul>
                ${this.each(this.props.colors, (color,  i) => `<li>${i}) ${color.name}</li>`)}
            </ul>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-list></my-list>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/Lgm7437o/)

---

### Scoped style
Doz provide since 1.4.0 version a property called `style` that allows you to add a pseudo scoped css as object literal.

```javascript

Doz.component('my-salutation', {
    style: {
        h1: {
            color: 'red',
            fontWeight: 'bold'
        },
        h2: {
            color: 'yellow'
        },
        '.foo, .bar': {
            display: 'inline'
        },
        '@media only screen and (max-width: 600px)': {
            'h1, h2': {
                color: 'white',
                backgroundColor: 'green'
            }
        }
    },
    template() {
        return `
            <div>
                <h1>Hello</h1>
                <h2>Doz</h2>
                <div class="foo">foo</div>
                <div class="bar">bar</div>
            </div>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <my-salutation></my-salutation>
    `
});
```

**Caution**, Doz adds a simple prefix like tag component to every rule and inject the style in to DOM in this way:

```
<head>
...
 <style> my-component .myClass{color:#000}</style>
</head>
```

If you need something stronger, please use other solution like [CSS Loader](https://github.com/webpack-contrib/css-loader).

---

### Inline style
Doz provide since 1.3.4 version a method called `toStyle` that allows you to transform an object to inline style string.

```javascript

const css = {
    background: '#000',
    color: '#fff'
};

Doz.component('my-button', {
    template() {
        return `
            <button
                ${this.toStyle(css)}
            >Hello button</button>
        `
    }
});

new Doz({
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

---

### Actions
The actions allows to better organize the logic of the various components in the app,
and they are global so can be called in all components.

```javascript
const actions = {
    toggleColor() {
        const store = this.getStore('my-button');
        store.done = !store.done;
    }
};

Doz.component('my-button', {
    store: 'my-button',
    props: {
        done: true
    },
    template() {
        return `
            <h2 style="color:${this.props.done ? 'red' : 'green' }">I'm a color</h2>
            <button onclick="this.action.toggleColor()">Toggle color</button>
        `
    }
});

new Doz({
    actions,
    root: '#app',
    template: `
        <h1>Welcome to my app:</h1>
        <my-button></my-button>
    `
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/je6ggukd/)

---

### Component logic inside Doz constructor
It's also possible creating an app with component logic inside Doz constructor like so:

```javascript
new Doz({
    root: '#app',
    props: {
        name: 'super DOZ'
    },
    template() {
        return `
            <h1>Welcome to ${this.props.name}</h1>
            <my-button onclick="this.$clickMe()"></my-button>
        `
    },
    $clickMe() {
        alert(this.props.name)
    }
});
```

---

### Develop and production
The best way to build app with Doz is using the great [Parcel Bundler](https://github.com/parcel-bundler/parcel) with zero configuration.

### Hot module replacement and state preservation
If you need preserve component state add just `module` to config:

```javascript
Doz.component('my-counter', {
    module,
    props: {
        count: 0
    },
    template() {
        return `
            <button onclick="this.props.count++">Count ${this.props.count}</button>
        `
    }
});
```

---

### Write a component
You can use [doz-cli](https://github.com/dozjs/doz-cli) at the moment the right way to creating a component.

---

## License
DOZ is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
