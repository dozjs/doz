# Component structure

When declare a component for example "my-component"

```js
Doz.component('my-component', {
    template(h) {
        return h`
            <div>
                My component
            </div>
        `
    }
});
```

it will be compiled and mounted into the DOM in this way

```   
<my-component> --------------> tag component
    <div> -------------------> tag root
        My component
    </div>
</my-component>
```

The tag component is also accessible via `this.getHTMLElement()`, 
this method returns the HTMLElement of the component.

A component with multiple tag without parent node inside the template:

```js
Doz.component('my-component', {
    template(h) {
        return h`
            <div>hello</div>
            <div>world</div>
        `
    }
});
```

instead it will be compiled in this way:

```   
<my-component> --------------> tag component
    <dz-root> ---------------> tag root
        <div>hello</div>
        <div>world</div>
    </dz-root>
</my-component>
```

Automatically Doz adds a special tag called dz-root and wrap the content
with it.