<div align="center">
<br/><br/>
<img width="300" src="https://raw.githubusercontent.com/fabioricali/doz/master/extra/doz.png" title="doz"/>
<br/><br/>
<br/><br/>
Build UI, so simple.
<br/><br/>
<a href="https://travis-ci.org/fabioricali/doz" target="_blank"><img src="https://travis-ci.org/fabioricali/doz.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
<br/><br/>
</div>

```
npm install --save doz
```

```html
<div id="app"></div>
```

```javascript
Doz.component('doz-button-counter', {
    template(){
        return `
            <div>
                <button onclick="this.myClickHandler()">${this.props.title}</button> <span class="counter">${this.props.counter}</span>
            </div>
        `
    },
    props: {
        counter: 0
    },
    myClickHandler() {
        this.props.counter += 1;
    }
});

new Doz({
    root: '#app',
    template: `
        <doz-button-counter title="Click me!"></doz-button-counter>
        <doz-button-counter title="Touch me!"></doz-button-counter>
    `
});
```

## Demo

<a href="https://fabioricali.github.io/doz/example/">Try now</a>

## This project is still under develop.
