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

Component compiled and mounted on the DOM

```   
<my-component>  -------------> tag wrapper
    <div> -------------------> tag root
        My component
    </div>
</tag-component>
```

The tag wrapper is accessible via `this.getHTMLElement()`, 
this method returns the HTMLElement of the component.

