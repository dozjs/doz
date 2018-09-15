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
<a href="https://github.com/dozjs/doz/blob/master/documentation/index.md">Documentation</a> | <a href="https://dozjs.github.io/doz/example/">Demo</a>
<br/><br/>
</div>

Tiny size: 9KB (gzip)

## Why another framework?
In the web there are many frameworks that do all the same things. But a lot of them are complex, we need to know a lot of directives and they make confusion for example with the context of "this", some introduce other syntaxes like JSX. All you need is HTML, CSS and Doz.

**Doz uses ES6 proxy to observe changes.**

## Installation
```
$ npm install --save doz
```

## Get started now and quickly?? Use [doz-cli](https://github.com/dozjs/doz-cli)
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
    template() {
        return `
            <div>
                <button onclick="this.props.counter++">
                    ${this.props.title} ${this.props.counter}
                </button>
            </div>
        `
    }
});
```

#### Make an app with the component defined above

```javascript
new Doz({
    root: '#app',
    template: `
        <button-counter title="Click me!"></button-counter>
    `
});
```


#### CDN unpkg
```html
<script src="https://unpkg.com/doz/dist/doz.min.js"></script>
```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/dozjs/doz/blob/master/CHANGELOG.md">here</a>

## License
DOZ is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
