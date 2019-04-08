# Component structure

Declare the component "my-component"

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

Component compiled and mounted into the DOM

```   
<my-component> --------------> tag wrapper
    <div> -------------------> tag root
        My component
    </div>
</tag-component>
```

The tag wrapper is accessible via `this.getHTMLElement()`, 
this method returns the HTMLElement of the component.

Multiple tag without parent node inside the template:

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
