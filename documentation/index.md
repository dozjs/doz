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
        - Inherited
    - Handlers
    - Events
    - Local component
- View component
- Directives
    - HTML element
    - DOZ component
- Loops,
- Actions
- Develop and production

## Component definition
The method `component` defines an component globally that can be added to any view of the project.

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
            <h2>${this.props.time}</h2>
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
        <my-clock></my-clock>
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