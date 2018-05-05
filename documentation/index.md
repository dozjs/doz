<div align="center">
<br/><br/>
<img width="100" src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz.png" title="doz"/>
<br/>
A JavaScript framework for building UI, almost like writing in VanillaJS.
</div>

# Documentation
Below some basic concepts:

- [Component definition](#component-definition)
    - Props
    - Methods
    - Events
    - Local component
- View component
- Directives
    - HTML element
    - DOZ component
- Loops

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

<a href="https://jsfiddle.net/fabioricali/ut18kyy1/" target="_blank">Result</a>