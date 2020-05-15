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
    - [Delay props update](#delay-props-update)
    - [Load props](#load-props)
    - [Props types](#props-types)
        - [Types available](#types-available)
    - [Reusing components](#reusing-components)
    - [Methods](#methods)
    - [Handlers](#handlers)
        - [Handlers old](#handlers-old)
            - [Inline logic old](#inline-logic-old)
            - [Passing arguments old](#passing-arguments-old)
    - [Emitter](#emitter)
    - [Lifecycle Hooks](#lifecycle-hooks)
    - [Drawing Hooks](#drawing-hooks)
    - [Local component](#local-component)
    - [Mount](#mount)
    - [Empty attributes in HTML element](#empty-attributes-in-html-element)
    - [Directives](#directives)
        - [HTML element](#html-element)
            - [d-bind](#d-bind)
            - [d-ref](#d-ref)
            - [d-is](#d-is)
            - [d-show](#d-show)
            - [d-animate](#d-animate)
        - [DOZ component](#doz-component)
            - [d:id](#did)
            - [d:store](#dstore)
            - [d:on](#don)
            - [Hooks directives](#hooks-directives)
        - [Custom directives](#custom-directives)
- [Ext Component: doz component as web component](#ext-component-doz-component-as-web-component)           
- [Sharing things](#sharing-things)
- [Conditional statements](#conditional-statements)
- [Loops](#loops)
- [Slots](#slots)
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
- [Component structure](https://github.com/dozjs/doz/blob/master/documentation/component-structure.md)
- [Reserved tags](#reserved-tags)

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

[LIVE](https://codepen.io/pen/KKKzQJK)

---

## Component definition
The method `define` or the alias `component` defines an component globally that can be added to any other component of the project.
The tag name must be according to the [W3C specs](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).

```javascript
Doz.define('hello-world', class extends Doz.Component {
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

[LIVE](https://codepen.io/pen/vYYGdPj/)

---

### Props
All props are stored into `props` (your component data) property of the component and they are accessible through a proxy that detect changes. When there are changes Doz update only the node that containing the updated prop.
Doz uses [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to build the component UI then the props are injected inside the string.

```javascript
class MyClock extends Doz.Component {
    constructor(o) {
        super(o);
        this.props = {
            time: '--:--:--'
        }
    }
    template(h) {
        return h`
            <h2>${this.props.title} <span>${this.props.time}</span></h2>
        `
    }
    onMount() {
        setInterval(() => this.props.time = new Date().toLocaleTimeString(), 1000)
    }
}

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <${MyClock} title="it's"/>
        `
    }
});
```

[LIVE](https://codepen.io/pen/eYYZVwz)

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

[FIDDLE](https://jsfiddle.net/ak0nzfbc/)

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

[FIDDLE](https://jsfiddle.net/t3qapk7r/)

---

### Delay props update

**Since 1.14.0**

If you need to delay the update of the props you can use the delayUpdate property, this is useful in case of animations.
The `onBeforeUpdate` event will be called without delay.

```javascript
Doz.component('my-delay', {
    delayUpdate: 1000, //ms

    props: {
        aNumber: 0
    },

    template() {
        return `
            <div>Number: ${this.props.aNumber}</div>
        `
    },

    onMount() {
        this.props.aNumber = 5;
    },

    onBeforeUpdate() {
        console.log('onBeforeUpdate');
        this.startUpdate = Date.now();
    },

    onUpdate() {
        const totalTime = Date.now() - this.startUpdate;
        console.log('onUpdate', totalTime);
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <my-delay/>
        `
    }
});
```

---

### Load props

**Since 1.16.0**

If you need to load the props a runtime, you can use `loadProps` method. 

```javascript
Doz.component('a-rnd', {
    template(h){
        return h`
            <div>
                <input type="text" d-bind="num"/>
                <p>Value: ${this.props.num}</p>
                <button onclick="this.setNew()">Load props</button>
            </div>
        `
    },
    props: {
        num: 0
    },
    setNew() {
        this.loadProps({
           num: Math.random()
        });
    },
    onLoadProps() {
        console.log('props loaded');
    }
});

new Doz({
    root: '#app',
    template: `
        <h3>Input type text</h3>
        <a-rnd/>
    `
});
```

---

### Props types

**Since 1.20.0**

propsType allows you to convert a prop to a specific type. This is very 
useful when using the d-bind directive since the value of the INPUT, 
SELECT etc. elements is always a string.

```javascript
Doz.component('my-types', {
    propsType: {
        myParam: 'string'
    },
    template() {
        return `
            <h3>This is number but string: ${this.props.myParam}</h3>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <my-types my-param="10"/>
        `
    }
});
```
---

#### Types available

- `string`
- `number`
- `boolean`
- `object`
- `array`
- `date`

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

This scenario could create some problems
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
            <h1>${this.props.title}</h1>
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

**Since 2.2.0**

All HTML element of a component accepts standard events.

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
            <button onclick="${this.clickMe}">Click me!</button>
        `
    },
    clickMe(e) {
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

---

### Handlers old

**Before 2.2.0**

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

[FIDDLE](https://jsfiddle.net/v0ejbsLs/)

---

#### Inline logic old

**Before 2.2.0**

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

#### Passing arguments old

**Before 2.2.0**

Doz keeps the types passed to the function.
`this` is a special placeholder that identify current instance.

```javascript
Doz.component('my-button', {
    template(h) {
        return h`
            <button onclick="this.clickme(${'hello'}, ${true}, ${123}, ${function(){return true}}, this)">Click me!</button>
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

[FIDDLE](https://jsfiddle.net/2spdq60k/)

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

### Drawing hooks

- `onAppDraw`: called every time any component (of the whole app) is drawn
    ```javascript
    Doz.component('hello-world', {
        template(h) {
            return h`
                <h2>Hello world</h2>
            `
        },
        onAppDraw(newNode, prevNode, component) {
            console.log(newNode, prevNode, component);
            // you can also manipulate the v-dom
            if (component.tag === 'the-clock')
                newNode.children.push('ciao');
        }
    });
    
    Doz.component('the-clock', {
        props: {
            time: '--:--:--'
        },
        template(h) {
            return h`
                <h2>${this.props.time}</h2>
            `
        },
        onMount() {
            setInterval(()=> this.props.time = new Date().toLocaleTimeString(), 1000);
        }
    });
    
    new Doz({
        root: '#app',
        template(h) {
            return h`
                <h1>Welcome to my app:</h1>
                <hello-world/>
                <the-clock/>
            `
        }
    });
    ```
    [FIDDLE](https://jsfiddle.net/5j24sxzb/)
    
- `onDrawByParent`: called every time component is drawn by the parent for example in a slot scenario

    ```javascript
    Doz.define('user-card', class extends Doz.Component {
    
        constructor(o) {
            super(o);
        }
    
        template(h) {
            return h`
                <div>
                    <slot name="name"/>
                  <div> 
                    <h2>Biography</h2>
                    <slot name="biography"/>
                    <hr/>
                    <slot name="projects">No projects</slot>
                  </div>
                </div>
            `
        }
        
        onDrawByParent(newNode, oldNode) {
            if (newNode.props.slot === 'name') {
                newNode.children.push(Doz.compile(`
                    <button onclick="console.log(scope)">Click</button>
                `));
            }
        }
    
    });
    
    new Doz({
    
        root: '#app',
    
        template(h) {
            return h`
                <user-card>
                    <h1 slot="name">Mike Ricali</h1>
                    <p slot="biography">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Quisque magna neque, pharetra ac felis ut,
                        finibus volutpat dolor. Orci varius.
                  </p>
                </user-card>
            `
        }
    
    });
    ```
    
    What is `scope`?
    ```
    <button onclick="console.log(scope)">Click</button>
    ```
    
    `scope` refers to `this` of user-card component.
    
    [FIDDLE](https://jsfiddle.net/42dp1tnL/)

---

### Local component

**Since 2.0.0**

As said previously, when define a component with `define` or `component` this will be global.
Doz also allows you to create local components:

```javascript
// Extendig the Component class
const HelloWorld = class extends Doz.Component {
    template(h) {
        return h`
            <h2>Hello World</h2>
        `
    }
}

// Or a simple function
const Other = function (h) {
    return h`
        <h3>Other</h3>
    `
}

new Doz({
    root: '#app',
    template(h) {
        return h`
            <h1>Welcome to my app:</h1>
            <${HelloWorld}/>
            <${Other}/>
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

[FIDDLE](https://jsfiddle.net/Lkeonppk/)

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
                <button onclick="this.showHello()">Mount</button>
            </div>
        `
    },
    
    showHello() {
    	this.mount('<hello-world/>');
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

[FIDDLE](https://jsfiddle.net/uz5sv1gr/2/)

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

[FIDDLE](https://jsfiddle.net/uLb9nw2d/)

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

[FIDDLE](https://jsfiddle.net/3eb8v19r/8/)

---

### Empty attributes in HTML element
In HTML there are some attributes such as "disabled" that can be defined 
without specifying any value. In Doz this is not possible, 
so for example `disabled` must be defined `disabled="true"`.

```javascript
Doz.component('my-button', {
    props: {
        buttonDisabled: true
    },
    template(h) {
        return h`
            <div>
                <button onclick="this.props.buttonDisabled = false">Enable button below</button>
                <button disabled="${this.props.buttonDisabled}">This button is disabled</button>
            </div>
        `
    }
});
```

### Directives
The directives are special attributes that are specified inside component tag.
There are two types:

#### HTML element
Directives that usually work only with HTML elements but there are 
exceptions such as `d-show` and `d-animate` which work with Doz components.

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

[FIDDLE](https://jsfiddle.net/2eeop7c5/)

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

[FIDDLE](https://jsfiddle.net/2kk0L1r8/)

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

##### d-show

**Since 1.25.0**

Show or hide an element.

```javascript
new Doz({
    root: '#app',
    template(h){
        return h`
            <h1>Welcome to my app:</h1>
            <h2 d-show=${false}>Wow!</h2>
        `
    }
});
```

---
##### d-animate

**Since 2.3.0**

This directive allows you to add CSS animations to components and HTML 
elements. By default, it is set to use the animate.css library, but you 
can also use custom animations or other libraries.

```javascript
new Doz({
    root: '#app',
    template(h){
        return h`
            <h1>Welcome to my app:</h1>
            <h2 d-animate="${{show: 'fadeIn'}}">Wow!</h2>
        `
    }
});
```

The d-animate directive accepts an object as a configuration. The main 
properties of the object are two: "show" and "hide".
The show property defines the CSS class will be used when an element 
will be displayed in the DOM. While the hide property will be used when 
an element will be hidden or removed from the DOM
Both show and hide properties can accept values as a string (just animation name) or object.

Below is an example of object configuration:

```javascript

const animationConfig = {
    show: {
        name: 'vanishIn',
        duration: '500ms',
        delay: '1000s',
        cb: () => console.log('animation show ends')
    },
    hide: {
        name: 'vanishOut',
        duration: '500ms',
        delay: '1000s',
        cb: () => console.log('animation hide ends')
    },
    // classLib defines the css class name of the framework that use for animations.
    // default is "animated", the class name of animate.css
    classLib: 'magictime' // For example, it will use another animation framework and relative animation names
};

new Doz({
    root: '#app',
    template(h){
        return h`
            <h1>Welcome to my app:</h1>
            <h2 d-animate="${animationConfig}">Wow!</h2>
        `
    }
});
```

PS: `d-show` supports the animation with `d-directive`.

**Important** Remember that to use animations you need to include CSS frameworks.

[FOR DEMO](https://dozjs.github.io/doz/example/)

---


#### DOZ component
Directives that works only on component

##### d:alias
This attribute allows you to define a unique name that identify the component locally inside component parent.

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
This attribute allows you to define a unique name that identify the component globally.

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

[FIDDLE](https://jsfiddle.net/w3dmq43a/)

---

##### d:store
This attribute allows you to define a unique name that expose your component props globally.

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

[FIDDLE](https://jsfiddle.net/yo6xeoc2/)

---

##### d:on
This attribute allows you to define a event name.

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

[FIDDLE](https://jsfiddle.net/tkzv5obd/)

---

##### Custom directives

**Since 1.25.0**

If you need to create a custom directive please look this directory.

[https://github.com/dozjs/doz/tree/master/src/directive/built-in](https://github.com/dozjs/doz/tree/master/src/directive/built-in)

---

### Hooks directives

**Since 1.15.0**

A listener can be associated with these directives:

- `d:oncreate`
- `d:onconfigcreate`
- `d:onmount`
- `d:onmountasync`
- `d:onupdate`
- `d:onunmount`
- `d:ondestroy`
- `d:onloadprops` (since 1.16.0)

```javascript
Doz.component('my-label', {
    template(h) {
        return h`
            <div>${this.props.title}</div>
        `
    }
});

new Doz({
    root: '#app',
    template(h) {
        return h`
            <my-label
                title="Mr. Robyn"
                d:oncreate="myLabelOnCreate"
                d:onmount="myLabelOnMount"
                d:onupdate="myLabelOnUpdate"
            />
        `
    },
    
    myLabelOnCreate(cmp) {
        console.log(cmp.tag, 'is created')
    },
    
    myLabelOnMount(cmp) {
        console.log(cmp.tag, 'is mounted')
    },
    
    myLabelOnUpdate(cmp, changes) {
        console.log(cmp.tag, 'is updated with this changes', changes)
    }
});
```

---

### Ext Component: doz component as web component

**Since 2.5.0**


If you need to use a doz component outside your JavaScript app then this is for you.
Calling the `Doz.createExtWebComponent` method will create a web component that will incorporate your doz component.
Keep in mind that the prefix "ext-" will be added to the tag, this to prevent Doz from processing possible web components that
have the same name as the doz components.

```javascript
    const myCmp1 = {
        template(h) {
            return h`
                    <div>Hello</div>
                    <button onclick="this.myClick()">Set random to myCmp2</button>
                `
        },
        myClick() {
            this.getExtWebComponentById('my-cmp2').props.title = Math.random();
        }
    }

    const myCmp2 = {
        props: {
            title: 'WoW'
        },       
        template(h) {
            return h`
                    <div>${this.props.title}</div>
                `
        }
    }

    createExtWebComponent('my-cmp1', myCmp1);
    createExtWebComponent('my-cmp2', myCmp2);
```
HTML
```html
<html>
    <head>
    <!-- doz library file-->
    <!-- doz components file -->
    </head>
    <body>
        <ext-my-cmp1></ext-my-cmp1>
        <ext-my-cmp2 data-id="my-cmp2"></ext-my-cmp2>
    </body>
</html>
```

The "data-id" attribute allows us to access an ext component from other components
using the method (in this case) `this.getExtWebComponentById ('my-cmp2')`.

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
            <my-button/>
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

[FIDDLE](https://jsfiddle.net/sevzodnu/)

---

### Loops
Same situation like conditional statements but using the method `each` provided by component:

```javascript
Doz.component('my-list', {
    props: {
        colors: [
            {
                id: 1,
                name: 'Red'
            },
            {
                id: 2,
                name: 'Green'
            },
            {
                id: 3,
                name: 'Orange'
            }
        ]
    },
    template(h) {
        return h`
            <ul>
                ${this.each(this.props.colors, (color,  i) => h`
                    <li key="${color.id}">${i}) ${color.name}</li>
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

**Important**: The attribute `key` help Doz identify which items have changed, are added, or are removed.

**Important**: Without `key`, the `onBeforeUnmount`, `onUnmount` and `onDestroy` events will not be called.

[FIDDLE](https://jsfiddle.net/Lgm7437o/)

---

### Slots

**Since 1.23.0**

Doz supports unnamed and named slots:

Unnamed:

```javascript
Doz.define('user-card', class extends Doz.Component {

    constructor(o) {
        super(o);
    }

    template(h) {
        return h`
            <div>
            	<h1>${this.props.name}</h1>
              <div> 
              	<h2>Biography</h2>
              	<slot/>
              </div>
            </div>
        `
    }

});

new Doz({

    root: '#app',

    template(h) {
        return h`
            <user-card name="Mike Ricali">
            	<p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Quisque magna neque, pharetra ac felis ut,
                    finibus volutpat dolor. Orci varius.
                </p>
            </user-card>
        `
    }

});
```

[FIDDLE](https://jsfiddle.net/un7qye53/)

Named:

```javascript
Doz.define('user-card', class extends Doz.Component {

    constructor(o) {
        super(o);
    }

    template(h) {
        return h`
            <div>
            	<slot name="name"/>
              <div> 
              	<h2>Biography</h2>
              	<slot name="biography"/>
                <hr/>
                <slot name="projects">No projects</slot>
              </div>
            </div>
        `
    }

});

new Doz({

    root: '#app',

    template(h) {
        return h`
            <user-card>
            	<h1 slot="name">Mike Ricali</h1>
            	<p slot="biography">
              	Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Quisque magna neque, pharetra ac felis ut,
                finibus volutpat dolor. Orci varius.
              </p>
            </user-card>
        `
    }

});
```

[FIDDLE](https://jsfiddle.net/ky9Ln7w4/)

---

### Scoped style

**Since 1.8.0**

Doz allows you to add the style inside template function, this emulate a scoped style.

```javascript

Doz.component('my-salutation', {
    template(h) {
        return h`

            <style>
                /* :wrapper rule referring to container in this case my-salutation */
                :wrapper {
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
            <my-salutation/>
        `
    }
});
```

**Since 1.26.0**

> Adding "scoped" attribute to tag "style" it's possible to reset css inheritance.

```js
class MyComponent1 extends Doz.Component {
    template(h) {
        return h`
            <style scoped>
                h1 {
                    font-size: 12px;
                }
            </style>

            <h1>Hello Doz</h1>
        `
    }
}

class MyComponent2 extends Doz.Component {
    template(h) {
        return h`
            <style scoped>
                h1 {
                    color: green;
                }
            </style>
            
            <!-- This will be green -->
            <h1>Hello Doz</h1>
            <!-- This will be black -->
            <${MyComponent1}/>
        `
    }
}
```

**Since 1.19.0**

> Doz adds a data-uid (unique ID) attribute to node HTML of component and inject the style in to DOM in this way:

```
<head>
...
 <style> [data-uid="1"] .myClass{color:#000}</style>
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

[FIDDLE](https://jsfiddle.net/je6ggukd/)

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

Mix multiple object:

```javascript
Doz.mixin([
    {
        method1() {},
        method2() {}
    },
    {
        method3() {},
        method4() {}
    }
]);

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

All the properties that need to be defined in `config`:

- `mixin`
- `components`
- `store`
- `id`
- `autoCreateChildren`
- `updateChildrenProps`

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

### Reserved tags

The tags you shouldn't use:

- dz-app
- dz-empty
- dz-mount
- dz-root
- dz-slot
- dz-text-node
- dz-iterate-node

---

## License
DOZ is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
