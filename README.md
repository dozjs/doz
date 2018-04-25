<div align="center">
<br/><br/>
<img width="300" src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz.png" title="doz"/>
<br/><br/>
<br/><br/>
A JavaScript framework for building UI, almost like writing in VanillaJS.
<br/><br/>
<a href="https://travis-ci.org/dozjs/doz" target="_blank"><img src="https://travis-ci.org/dozjs/doz.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
<br/><br/>
</div>

## This project is still under develop.

```
npm install --save doz
```

```html
<div id="app"></div>
```

```javascript
Doz.component('button-counter', {
    props: {
        counter: 0
    },
    template(){
        return `
            <div>
                <button onclick="this.click()">${this.props.title}</button>
                <span class="counter">${this.props.counter}</span>
            </div>
        `
    },
    click() {
        this.props.counter += 1;
    }
});

new Doz({
    root: '#app',
    template: `
        <button-counter title="Click me!"></button-counter>
    `
});
```

## Demo

<a href="https://dozjs.github.io/doz/example/">Try now</a>
