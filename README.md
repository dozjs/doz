# doz
Build UI, so simple.

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
