<div align="center">
<br/><br/>
<img width="300" src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz.png" title="doz"/>
<br/><br/>
<br/><br/>
A JavaScript framework for building UI, almost like writing in VanillaJS. For modern browser.
<br/><br/>
<a href="https://travis-ci.org/dozjs/doz" target="_blank"><img src="https://travis-ci.org/dozjs/doz.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
<br/><br/>
<a href="https://github.com/dozjs/doz/blob/master/documentation/index.md">Documentation</a> 
| <a href="https://github.com/dozjs/doz/blob/master/documentation/api.md">API</a> 
| <a href="https://dozjs.github.io/doz/example/">Demo</a> 
| <a href="https://github.com/dozjs/doz/tree/master/example">Browse example code</a>
<br/><br/>
</div>

## Why
- 🎼 Works with tagged template literals
- 🔫 Fast performance
- 💅 Scoped style
- 📡 Uses ES6 proxy to observe changes
- 🎳 Component based
- 😁 Simple and familiar API
- 😱‍ No extra syntax like JSX
- 💣 No confusion with props and state
- ⛏ Extensible through: plugins, mixin, components

## Another framework?
In the web there are many frameworks that do all the same things. But a lot of them are complex, we need to know a lot of directives and they make confusion for example with the context of "this".

## Installation
```
$ npm install -g doz-cli

$ doz app my-app
$ cd my-app
$ npm run start
```

## Example

```html
<div id="app"></div>
```

#### Component definition

```javascript
Doz.component('button-counter', {

    props: {
        counter: 0
    },

    template(h) {
        return h`

            <style>
                button {
                    background: #ff000;
                    color: #fff;
                }
            </style>

            <button onclick="this.props.counter++">
                ${this.props.title} ${this.props.counter}
            </button>

        `
    }

});
```

#### Make an app with the component defined above

```javascript
new Doz({

    root: '#app',

    template(h) {
        return h`
            <button-counter title="Click me!"/>
        `
    }

});
```

## Doz ecosystem
- 👨🏻‍💻 [doz-cli](https://github.com/dozjs/doz-cli) provide a boilerplate to creating app and component
- 👨🏼‍🎨 [doz-ssr](https://github.com/dozjs/doz-ssr) server side rendering
- 🤳🏼 [doz-snap](https://github.com/dozjs/doz-snap) transform app to static HTML
- 👩🏼‍🚀 [doz-router](https://github.com/dozjs-cmp/doz-router) a complete component for routing
- ✍🏼 [doz-metatag](https://github.com/dozjs/doz-metatag) a plugin for managing basic OG meta tag in your HTML document

#### CDN unpkg
```html
<script src="https://unpkg.com/doz/dist/doz.min.js"></script>
```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/dozjs/doz/blob/master/CHANGELOG.md">here</a>

## License
Doz is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
