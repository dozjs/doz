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
    - [Props listener](#props-listener)
    - [Props computed](#props-computed)
    - [Props convert](#props-convert)
    - [Reusing components](#reusing-components)
    - [Methods](#methods)
    - [Handlers](#handlers)
        - [Inline logic](#inline-logic)
        - [Passing arguments](#passing-arguments)
    - [Emitter](#emitter)
    - [Lifecycle Hooks](#lifecycle-hooks)
    - [Local component](#local-component)
    - [Mount](#mount)
    - [Directives](#directives)
        - [HTML element](#html-element)
            - [d-bind](#d-bind)
            - [d-ref](#d-ref)
            - [d-is](#d-is)
        - [DOZ component](#doz-component)
            - [d:id](#did)
            - [d:store](#dstore)
            - [d:on](#don)
- [Sharing things](#sharing-things)
- [Conditional statements](#conditional-statements)
- [Loops](#loops)
- [Scoped style](#scoped-style)
- [Inline style](#inline-style)
- [Actions](#actions)
- [Mixins](#mixins)
- [Plugins](#plugins)
- [ES6 class](#es6-class)
- [SFC: Single Function Component](#sfc-single-function-component)
- [Component logic inside Doz constructor](#component-logic-inside-doz-constructor)
- [Develop and production](#develop-and-production)
    - [Hot module replacement and state preservation](#hot-module-replacement-and-state-preservation)
- [Write app or component](#develop-and-production)
- [IE11 support](#ie11-support)
- [API](https://github.com/dozjs/doz/blob/master/documentation/api.md)

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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <h2>Hello World</h2>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/rx9ps5s4/)

---

## Component definition
The method `component` defines an component globally that can be added to any other component of the project.
The tag name must be according to the [W3C specs](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).

```javascript
Doz.component('hello-world', {
    template(h) {
        return h`
            <h2>Hello World</h2>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <hello-world></hello-world>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/ut18kyy1/)

> How define a component with [ES6 class](#es6-class)?

---

### Props
All props are stored into `props` (your component data) property of the component and they are accessible through a proxy that detect changes. When there are changes Doz update only the node that containing the updated prop.
Doz uses [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to build the component UI then the props are injected inside the string.

```javascript
Doz.component('my-clock', {
    props: {
        time: '--:--:--'
    },
    template(h) {
        return h`
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    },
    onMount() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-clock title="it's"></my-clock>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/8qp9co1o/3)

---

### Props listener

**Since 1.8.0**

Doz provides an API called propsListener that allows you to associate an handler to determinate prop.
The handler will be triggered to every change for given prop.

```javascript
Doz.component('my-clock', {
    props: {
        time: '--:--:--'
    },
    propsListener: {
        time: function(newValue, oldValue) {
            console.log('Prop time is changed', newValue, oldValue);
        }
    },
    template(h) {
        return h`
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    },
    onMount() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-clock title="it's"></my-clock>
        `
    }
});
```

---

### Props computed

**Since 1.9.0**

This is useful for performing complex computational operations.
The result will be saved in cache.

```javascript
Doz.component('my-computed', {
    props: {
        aNumber: 0
    },
    propsComputed: {
        aNumber: function(v) {
            return v * Math.random();
        }
    },
    template() {
        return `
            <input type="number" value="0" min="0" d-ref="inputNumber"/>
            <button onclick="this.props.aNumber = this.ref.inputNumber.value">Compute</button>
            <h3>Result ${this.props.aNumber}</h3>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>a number multiplied by a random number</h1>
            <my-computed/>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/ak0nzfbc/)

---

### Props convert

**Since 1.12.0**

It is similar to `propsComputed` with the difference that the result will not be saved in any cache.

```javascript
Doz.component('my-clock', {
    props: {
        time: '--:--:--'
    },
    propsConvert: {
        time: function(newValue) {
            return `Prepend this string before: ${newValue}`;
        }
    },
    template(h) {
        return h`
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    },
    onMount() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-clock title="it's"></my-clock>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/t3qapk7r/)

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

or put definition into `onCreate` hook
```javascript
onCreate: function(){
    this.props = {
        other: {
            value: 0
        }
    }
}
```

But if you use the new ES6 pattern class, the problem does not arise. More info [ES6 class](#es6-class)

### Methods
The methods are defined inside a single object where there are also props and events.
**Why this choice?** Because during development it's essential to have an exact reference of `this` context.

```javascript
Doz.component('my-component', {
    props: {
        title: 'Hello World'
    },
    template(h) {
        return h`
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

### Handlers
All HTML element of a component accepts standard events. It's possible also passing a component method or [actions](#actions).

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
            <button onclick="this.clickme()">Click me!</button>
        `
    },
    clickme(e) {
        alert(e)
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/v0ejbsLs/)

---

#### Inline logic

**Since 1.3.2**

Doz supports also inline logic. Normally `this` is reference of HTML element but in Doz it's every reference of component instance.

```javascript
Doz.component('my-button', {
    props: {
        count: 0
    },
    template(h) {
        return h`
            <button onclick="this.props.count++">Click me!</button>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

#### Passing arguments
The method passed to event is transformed by Doz (in reality it's a string) so the arguments are automatically casted.
`this` is a special placeholder that identify current instance.

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/1wj852pd/)

> If you want the HTMLElement reference inside the handler you can use `$this`.

---

### Emitter
Any component can emit a custom event. See also [component directives](#doz-component).

```javascript
Doz.component('salutation-card', {
    template(h) {
        return h`<caller-o d:on-mycallback="aCallback"></caller-o>`
    },
    aCallback: function(arg) {
        alert('callback is called: ' + arg);
    }
});

Doz.component('caller-o', {
    template(h) {
        return h`<button onclick="this.emit('mycallback', 'hello world')">Callback</button>`
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <salutation-card></salutation-card>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/2spdq60k/)

---

### Lifecycle Hooks
In order all hooks:
- `onBeforeCreate`: called before that instance is created.
- `onCreate`: called after that instance is created.
- `onConfigCreate`: called after that instance is created (Only in ES6 pattern and if `config` object is set) [ES6 class](#es6-class).
- `onBeforeMount`: called before that instance is mounted on DOM.
- `onAfterRender`: called every time after that `render()` method has been called.
- `onMount`: called after that instance is mounted on DOM.
- `onMountAsync`: called after that instance is mounted on DOM.
- `onBeforeUpdate`: called before that instance is updated.
- `onUpdate`: called after that instance is updated.
- `onBeforeUnmount`: called before that instance is unmounted.
- `onUnmount`: called after that instance is unmounted.
- `onBeforeDestroy`: called before that instance is destroyed.
- `onDestroy`: called after that instance is destroyed.

> Any event with prefix "onBefore" if returns `false` the next event will not called.

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
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <hello-world></hello-world>
        `
    }
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
        template(h) {
            return h`
                <h2>Hello World</h2>
            `
        }
    }
}

new Doz({
    components: [helloWorld],
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <hello-world></hello-world>
        `
    }
});

// Second way
const helloWorld = {
    template(h) {
        return h`
            <h2>Hello World</h2>
        `
    }
}

new Doz({
    components: {
        'hello-world': helloWorld
    },
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <hello-world></hello-world>
        `
    }
});
```

Also components supports local components:

**Since 1.1.0**

```javascript
// First
const hello = {
    template(h) {
        return h`
            <span>Hello</span>
        `
    }
}

// Second
const world = {
    template(h) {
        return h`
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
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <hello-world></hello-world>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/Lkeonppk/)

---

### Mount
Doz component instance provide a method called `mount`,
this method allows you to "append" a new component inside another.

```javascript
Doz.component('hello-world', {
    template(h) {
        return h`
            <h2>Hello World</h2>
        `
    }
});

Doz.component('my-wrapper', {
    template(h) {
        return h`
            <div>
                <button onclick="this.mount('<hello-world></hello-world>')">Mount</button>
            </div>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-wrapper></my-wrapper>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/c4kaoc95/)

---

Mount component in a specific root inside a parent:

```javascript
Doz.component('hello-world', {
    template(h) {
        return h`
            <h2>Hello World</h2>
        `
    }
});

Doz.component('my-wrapper', {
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-wrapper></my-wrapper>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/uLb9nw2d/)

---

### Unmount
You can also unmount a component.

```javascript
Doz.component('my-wrapper', {
    template(h) {
        return h`
            <div>
                <h2>Hello World</h2>
                <button onclick="this.unmount()">Unmount</button>
            </div>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-wrapper></my-wrapper>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/3eb8v19r/8/)

### Directives
The directives are special attributes that are specified inside component tag.
There are two types:

#### HTML element
Directives that works only on HTML element.

##### d-bind
This directive bind an input element to a props:

```javascript
Doz.component('input-message', {
    template(h){
        return h`
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
    template(h) {
        return h`
            <input-message placeholder="write a message"></input-message>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/2eeop7c5/)

---

##### d-ref
Sometimes it's necessary to have a easy reference to an HTML element in your component, this directive does it.

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/2kk0L1r8/)

---

##### d-is

**Since 1.6.1**

Sometimes it is necessary to render a component inside tags like UL which only accepts LI as child nodes. The "d-is" directive can identify any HTML element as a Doz component.

```javascript
Doz.component('my-item', {
    template(h) {
        return h`
            <span>${this.props.color}</span>
        `
    }
});

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
    template(h) {
        return h`
            <ul>
                ${this.each(this.props.colors, color => h`
                    <li d-is="my-item" color="${color.name}"></li>
                `)}
            </ul>
        `
    }
});

new Doz({
    root: '#app',
    template(h){
        return h`
            <h1>Welcome to my app:</h1>
            <my-list></my-list>
        `
    }
});
```

---

#### DOZ component
Directives that works only on component

##### d:alias
This attribute allows you to define an unique name that identify the component locally inside component parent.

```javascript
Doz.component('my-label', {
    template(h) {
        return h`
            <label>I'm a label</label>
        `
    }
});

Doz.component('my-button', {
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

##### d:id
This attribute allows you to define an unique name that identify the component globally.

```javascript
Doz.component('my-label', {
    template(h) {
        return h`
            <label>I'm a label</label>
        `
    }
});

Doz.component('my-button', {
    template(h) {
        return h`
            <button onclick="this.clickme()">Get component by alias!</button>
        `
    },
    clickme(e) {
        alert(this.getComponentById('wowo'));
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-label d:id="wowo"></my-label>
            <my-button></my-button>
        `
    }
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
    template(h) {
        return h`
            <label>${this.props.title}</label>
        `
    }
});

Doz.component('my-button', {
    template(h) {
        return h`
            <button onclick="this.clickme()">Update label</button>
        `
    },
    clickme(e) {
        this.getStore('wowo').title = 'Hello world!';
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-label d:store="wowo"></my-label>
            <my-button></my-button>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/yo6xeoc2/)

---

##### d:on
This attribute allows you to define an event name.

```javascript
Doz.component('salutation-card', {
    template(h) {
        return h`<div>${this.props.salutation} ${this.props.title} ${this.props.name} <caller-o d:on-mycallback="aCallback"></caller-o></div>`
    },
    aCallback: function(newSalutation) {
        this.props.salutation = newSalutation;
        alert(newSalutation);
    }
});

Doz.component('caller-o', {
    template(h) {
        return h`<div>This component emit an event</div>`
    },
    onCreate() {
        setTimeout(()=>{
            this.emit('mycallback', 'Ciao');
        },1000);
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <salutation-card
                salutation="Hello"
                title="MR."
                name="Doz">
            </salutation-card>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/tkzv5obd/)

---

### Sharing things

**Since 1.8.0**

Doz provides an API called `shared` that allows you of sharing things between components.

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
            <button>Click ${this.shared.foo}</button>
        `
    }
});

new Doz({
    root: '#app',
    shared: {
        foo: 'bar'
    },
    template(h) {
        return h`
            <my-button></my-button>
        `
    }
});
```

---

### Conditional statements
As said previously Doz use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```javascript
Doz.component('my-button', {
    props: {
        done: true
    },
    template(h) {
        return h`
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
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
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
    template(h) {
        return h`
            <ul>
                ${this.each(this.props.colors, (color,  i) => h`
                    <li>${i}) ${color.name}</li>
                `)}
            </ul>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-list></my-list>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/Lgm7437o/)

---

### Scoped style

**Since 1.8.0**

Doz allows you to add the style inside template function, this emulate a scoped style.

```javascript

Doz.component('my-salutation', {
    template(h) {
        return h`

            <style>
                /* :root rule referring to container in this case my-salutation */
                :root {
                    border: 1px solid #ff0000;
                }

                /* :global rule refering to global item */
                :global button {
                    background: #ffcc00;
                }

                h1 {
                    color: red;
                    font-weight: bold;
                }

                .foo{
                    display: inline;
                }

                @media only screen and (max-width: 600px) {
                    h1 {
                        color: white;
                        background-color: green;
                    }
                }
            </style>

            <h1>Hello Doz</h1>
            <div class="foo">foo</div>

        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <my-salutation></my-salutation>
        `
    }
});
```

> **Psss**, Doz adds a simple prefix like tag component to every rule and inject the style in to DOM in this way:

```
<head>
...
 <style> my-component .myClass{color:#000}</style>
</head>
```

---

### Inline style

**Since 1.3.4**

Doz provide a method called `toStyle` that allows you to transform an object to inline style string.

```javascript

const css = {
    background: '#000',
    color: '#fff'
};

Doz.component('my-button', {
    template(h) {
        return h`
            <button
                ${this.toStyle(css)}
            >Hello button</button>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
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
    template(h) {
        return h`
            <h2 style="color:${this.props.done ? 'red' : 'green' }">I'm a color</h2>
            <button onclick="this.action.toggleColor()">Toggle color</button>
        `
    }
});

new Doz({
    actions,
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <my-button></my-button>
        `
    }
});
```

[FIDDLE](https://jsfiddle.net/fabioricali/je6ggukd/)

---

### Mixins

**Since 1.5.0**

Doz provide you two way for add reusable functions to components:

#### Global mixin
The functions are available for every component.

```javascript
Doz.mixin({
   sum(a, b) {
       return a + b;
   }
});

Doz.component('a-component', {
    template(h) {
        return h`
            <div>Sum of 4 + 5 = ${this.sum(4, 5)}</div>
        `
    }
});
```

#### Local mixin
The functions are available only for a component.

```javascript
const myFunctions = {
   sum(a, b) {
       return a + b;
   }
};

Doz.component('a-component', {
    mixin: myFunctions,
    template(h) {
        return h`
            <div>Sum of 4 + 5 = ${this.sum(4, 5)}</div>
        `
    }
});

// Sum method is undefined
Doz.component('other-component', {
    template(h) {
        return h`
            <div>Sum of 10 + 10 = ${this.sum(10, 10)}</div>
        `
    }
});
```

Ps: Mixins **don't overwrite** existing functions, since 1.7.0 a warning message will be showed into console.

### Plugins

**Since 1.6.0**

Sometimes it's useful to have methods at global level that extend
new functionality to framework, for this, Doz since 1.6.x version
provide you "Doz.use". Write a plugin is very easy:

```javascript
const myPlugin = function(Doz, app, options) {

    // You can adds mixin function
    Doz.mixin({
        localTime() {
            return new Date().toLocaleTimeString();
        }
    });

    // Manipulate virtual dom like:
    // Add a button to component that have an attribute "with-button"
    function addButton(child) {
        child.children.forEach(el => {
            if (el.props && el.props['with-button'] !== undefined) {

                // Doz.compile transforms HTML string to tree object
                const compiled = Doz.compile(`
                    <button onclick="console.log($this)">${options.buttonLabel}</button>
                `);

                el.children.push(compiled)
            }
        })
    }

    // This event is called to every change of the whole app
    app.on('draw', (next, prev, componentInstance) => {
        addButton(next);
    });

};

// Add plugin to Doz passing some options
Doz.use(myPlugin, {
    buttonLabel: 'click me'
});

Doz.component('my-component', {
    template(h) {
        return h`
            <div with-button>
                current time: ${this.currentTime()}
            </div>
        `
    }
});
```

### ES6 class

**Since 1.5.0**

If you prefer programming with ES6 class syntax:

```javascript
Doz.define('a-component', class extends Doz.Component{
    template(h){
        return h`<div>Hello ES6</div>`
    }
});
```

Define default props

```javascript
Doz.define('a-component', class extends Doz.Component{
    constructor(o) {
        super(o);

        this.props = {
            name: 'ES6'
        };
    }

    template(h){
        return h`<div>Hello ${this.props.name}</div>`
    }
});
```

Define default config with `config` property (available only for this pattern)

```javascript
Doz.define('a-component', class extends Doz.Component{
    constructor(o) {
        super(o);

        this.config = {
            store: 'myStoreName',
            id: 'myComponentId'
        };
    }

    template(h){
        return h`<div>Hello ${this.props.name}</div>`
    }
});
```

> To registering a global component now we use `define` an alias of `component` for don't confuse you with `Component` subclass

---

### SFC: Single Function Component

**Since 1.11.0**

SFC gives you the ability to define simple components that do not need
configurations, such as default props, methods or events.
Define a component with a single function:

```javascript
Doz.component('my-sfc', function(h) {
    return h`<div>Hello ${this.props.name}</div>`
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <my-sfc name="Doz"/>
        `
    }
});
```

---

### Component logic inside Doz constructor
It's also possible creating an app with component logic inside Doz constructor like so:

```javascript
new Doz({
    root: '#app',
    props: {
        name: 'super DOZ'
    },
    template(h) {
        return h`
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
    template(h) {
        return h`
            <button onclick="this.props.count++">Count ${this.props.count}</button>
        `
    }
});
```

---

### Write app or component
You can use [doz-cli](https://github.com/dozjs/doz-cli) at the moment the right way to creating a component or an app.

---

### IE11 support
Doz uses ES6 proxy that unfortunately is not supported by IE11. You must include two polyfills in your document.

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes"></script>
<script src="https://unpkg.com/doz/polyfill/proxy.js"></script>
```

---

## License
DOZ is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
