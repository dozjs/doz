<div align="center">
<br/><br/>
<img src="https://raw.githubusercontent.com/dozjs/doz/master/extra/doz-header.png" title="doz"/>
<br/><br/>
<br/><br/>
Almost like writing in VanillaJS. For modern browser.
<br/><br/>
<a href="https://travis-ci.org/dozjs/doz" target="_blank"><img src="https://travis-ci.org/dozjs/doz.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
<img src="https://img.shields.io/badge/Node.js-%3E%3D10.x.x-green.svg" title="Node.js version"/>
<br/><br/>
<a href="https://github.com/dozjs/doz/blob/master/documentation/index.md">Documentation</a> 
| <a href="https://github.com/dozjs/doz/blob/master/documentation/api.md">API</a> 
| <a href="https://dozjs.github.io/doz/example/">Demo</a> 
| <a href="https://github.com/dozjs/doz/tree/master/example">Browse example code</a>
<br/><br/>
👉 <a href="https://play.radionorba.it">SEE A PROJECT BUILT WITH DOZ</a> 👈
<br/><br/>
<img src="https://raw.githubusercontent.com/dozjs/doz/master/extra/login-form-example.gif" title="A login form built with Doz"/>
<br>
<a href="https://codepen.io/fabioricali/pen/poveXwo">Look at the code on Codepen</a>
<br/><br/>
</div>

## Why
- 🎼 Works with tagged template literals
- 🎳 Component based
- 🧩 WebComponent ready
- 🏪 Global stores
- 😆 Global components
- 🔫 Fast performance
- 💅 Scoped style
- 📡 Uses ES6 proxy to observe changes
- 😁 Simple and familiar API
- 😱‍ No extra syntax like JSX
- 💣 No confusion with props and state
- ⛏ Extensible through: plugins, mixin, components
- 📽 CSS animation support

## Get started
```
$ npx doz-cli app my-app
$ cd my-app
$ npm start
```

## Example

```html
<div id="app"></div>
```

#### Component definition

ButtonCounter.js
```javascript
import {Component} from 'doz'

export default class ButtonCounter extends Component {
    
    constructor(o) {
        super(o);
        this.props = {
            counter: 0
        };
    }

    template(h) {
        return h`
            <style>
                button {
                    font-size: 16px;
                    padding: 20px;
                }
            </style>

            <button onclick="${this.increase}">
                count ${this.props.counter}
            </button>
        `
    }
    
    increase() {
        this.props.counter++;
    }

};
```

#### Make an app with the component defined above

app.js
```javascript
import {appCreate} from 'doz'
import ButtonCounter from './ButtonCounter'

appCreate('#app', ButtonCounter);
```

## Doz ecosystem
- 👨🏻‍💻 [doz-cli](https://github.com/dozjs/doz-cli) provides a boilerplate to creating app and component
- 👨🏼‍🎨 [doz-ssr](https://github.com/dozjs/doz-ssr) server side rendering
- 🤳🏼 [doz-snap](https://github.com/dozjs/doz-snap) transforms app to static HTML
- 👩🏼‍🚀 [doz-router](https://github.com/dozjs-cmp/doz-router) a complete component for routing
- ✍🏼 [doz-metatag](https://github.com/dozjs/doz-metatag) a plugin for managing basic OG meta tag in your app (perfect with doz-ssr)

#### CDN unpkg
```html
<script type="module">
    import {Component} from 'https://unpkg.com/doz/dist/doz.min.js'
    //...
</script>
```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/dozjs/doz/blob/master/CHANGELOG.md">here</a>

## License
Doz is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
