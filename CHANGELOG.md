# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]
- **Added** `d-animate` directive for animation
- **Added** `animate` helper to Component
- **Added** support for animation to `d-show`
- **Improved** HTML boolean attribute support
- **Improved** directive attributes, now supports also object

## [2.2.2] - 2019-11-25
- **Removed** console log in directive `d-show`

## [2.2.1] - 2019-11-24
- **Added** support handler as function to `d-on` directive
- **Improved** catch logic for handler into template

## [2.2.0] - 2019-11-24
- **Added** support handler as function instead string for html element
- **Fixed** memory leak using element handler
- **Improved** performance

## [2.1.3] - 2019-11-19
- **Fixed** 'Cannot call a class as a function' with mount method

## [2.1.2] - 2019-11-19
- **Fixed** issue when before a slot there are a text child

## [2.1.1] - 2019-11-16
- **Updated** readme example

## [2.1.0] - 2019-11-15
- **Added** `tag` decorator

## [2.0.8] - 2019-11-14
- **Fixed** issue when `each` method returns empty array
- **Improved** style manager 

## [2.0.7] - 2019-11-12
- **Fixed** possible issue of style with pseudo classes 

## [2.0.6] - 2019-11-11
- **Changed** installation method, using npx instead npm, this solve issue on Mac.

## [2.0.5] - 2019-11-09
- **Added** project built with Doz

## [2.0.4] - 2019-11-08
- **Added** support to components created by object

## [2.0.2] - 2019-11-08
- **Fixed** possible undefined style element

## [2.0.1] - 2019-11-07
- **Fixed** style issues

## [2.0.0] - 2019-11-07
- **Added** support to new local components with class
- **Added** key attribute for keyed loops
- **Changed** now props in template preserves the type
- **Removed** directive `d-key`
- **Fixed** Keyed loops

## [1.26.0] - 2019-10-17
- **Added** attribute `scoped` to tag style
- **Improved** sanitization input values

## [1.25.0] - 2019-10-12
- **Added** directive 'd-show'
- **Added** 'props' as second argument to template function
- **Improved** directive 'd-key', now works also with no component elements
- **Improved** directives organization
- **Fixed** issue with comments into scoped style [#9](https://github.com/dozjs/doz/issues/9)
- **Fixed** data-uid is undefined [#10](https://github.com/dozjs/doz/issues/10)
- **Fixed** attributes with dash (-) are "duplicated" without dash [#13](https://github.com/dozjs/doz/issues/13)

## [1.24.0] - 2019-08-24
- **Changed** attributes "style" and "class" will not be removed from the component tag during render

## [1.23.1] - 2019-08-20
- **Fixed** `onDrawByParent` was not called when there is a slot

## [1.23.0] - 2019-08-19
- **Added** support to slots
- **Added** `onDrawByParent` event to component, useful for nested component
- **Added** magic word "scope" for listener referred to manipulation of v-dom inside `onDrawByParent` event 

## [1.22.2] - 2019-08-15
- **Fixed** last dynamic component created into a list don't works fine

## [1.22.1] - 2019-08-15
- **Added** alias pseudo element :component
- **Fixed** minors
- **Changed** logo header

## [1.22.0] - 2019-08-14
- **Added** `mainComponent` property to Doz instance
- **Improved** nested component system
- **Deprecated** into style system the pseudo element ":root" in favor of ":wrapper"

## [1.21.1] - 2019-08-13
- **Fixed** an issue relative to nested component system. If last node is a dz-root, the new element created must be insert before it.

## [1.21.0] - 2019-08-12
- **Improved** nested component system
- **Changed** template parser, now removes all spaces after new line and tab
- **Fixed** possible wrong parent component
- **Fixed** when bind value is 0 don't works
- **Removed** specials attributes from compiled code

## [1.20.2] - 2019-07-09
- **Fixed** "Cannot call a class as a function" during development

## [1.20.1] - 2019-07-08
- **Fixed** another possible error "Cannot call a class as a function" when using a component built with class pattern or single function

## [1.20.0] - 2019-06-08
- **Added** `propsType` object config, now it is possible define a type for each prop.
- **Improved** auto-cast

## [1.19.0] - 2019-05-29
- **Added** directive `d-key` for loops
- **Added** `uId` property
- **Fixed** possible wrong destroy components
- **Improved** scoped style, now creates a style for each component instance

## [1.18.3] - 2019-05-23
- **Fixed** empty initial input when use d-bind

## [1.18.2] - 2019-05-22
- **Fixed** possible error "Cannot call a class as a function" when using a component built with class pattern or single function

## [1.18.1] - 2019-05-13
- **Fixed** undefined `ref`

## [1.18.0] - 2019-05-12
- **Improved** virtual-dom logic now is better organized with new class named DOMManipulation
- **Changes** minor refactoring of some stuff

## [1.17.1] - 2019-04-24
- **Fixed** multiple :global style in same line

## [1.17.0] - 2019-04-23
- **Added** `renderPause` method to component
- **Added** `renderResume` method to component
- **Added** `isRenderPause` property to component
- **Improved** IE11 support

## [1.16.9] - 2019-04-11
- **Fixed** possible issues during attributes changes

## [1.16.8] - 2019-04-11
- **Fixed** error when the virtual-dom does not match (removeAttribute)

## [1.16.6] - 2019-04-09
- **Fixed** error when the virtual-dom does not match

## [1.16.5] - 2019-04-08
- **Fixed** possible null error when a component is destroyed

## [1.16.4] - 2019-04-07
- **Fixed** possible memory leak when a component is destroyed

## [1.16.3] - 2019-04-03
- **Fixed** layout issues during mount, unmount and remount

## [1.16.2] - 2019-03-27
- **Fixed** the defined store is not deleted after destroying the component
- **Fixed** the defined id is not deleted after destroying the component

## [1.16.0] - 2019-03-17
- **Added** `loadProps` method
- **Added** new hook `onLoadProps`
- **Added** directive instance hook `d:onloadprops`
- **Added** app hook `componentLoadProps`
    
## [1.15.0] - 2019-03-09
- **Added** `propsListenerAsync`
- **Added** directive instance hooks
    - `d:oncreate`
    - `d:onconfigcreate`
    - `d:onmount`
    - `d:onmountasync`
    - `d:onupdate`
    - `d:onunmount`
    - `d:ondestroy`
- **Added** new hooks of app
    - `componentCreate`
    - `componentConfigCreate`
    - `componentMount`
    - `componentMountAsync`
    - `componentUpdate`
    - `componentUnmount`
    - `componentDestroy`
- **Changed** now propsConvert and propsComputed are called on beforeMount event   
- **Fixed** auto-cast when bind an input

## [1.14.0] - 2019-02-10
- **Added** `delayUpdate`

## [1.13.0] - 2019-02-02
- **Added** `propsComputedOnFly`
- **Added** `propsConvertOnFly`
- **Improved** minor things

## [1.12.4] - 2019-02-01
- **Fixed** apply `propsConvert` and `propsComputed` to initial props

## [1.12.3] - 2019-02-01
- **Fixed** possible issues of `propsConvert` and `propsComputed`

## [1.12.2] - 2019-02-01
- **Fixed** drawDynamics may not works
- **Changed** remove new line space from attributes during the compiling

## [1.12.1] - 2018-12-24
- **Fixed** cache issue for `propsComputed`

## [1.12.0] - 2018-12-23
- **Added** `propsConvert` api for props manipulation without cache
- **Improved** performance

## [1.11.1] - 2018-12-15
- **Fixed** SFC issue when create a bundle with ParcelJS

## [1.11.0] - 2018-12-15
- **Added** support to Single Function Component (SFC)

## [1.10.0] - 2018-12-08
- **Removed** `style` object, deprecated since 1.8.0
- **Removed** `onRender` hooks in favor of `onMount`, deprecated since 1.0.0
- **Improved** bundle size

## [1.9.0] - 2018-11-29
- **Added** `propsComputed` api for props manipulation
- **Fixed** `parentNode` is `null` when using scoped style without others tags

## [1.8.4] - 2018-11-22
- **Fixed** scoped style issue when using animation

## [1.8.3] - 2018-11-20
- **Fixed** possible issue when using style tag inside `h` tagged function

## [1.8.2] - 2018-11-20
- **Added** support to `propsListener` for value as function

## [1.8.1] - 2018-11-18
- **Fixed** `this` argument for `propsListener`

## [1.8.0] - 2018-11-17
- **Added** support for scoped style into template function
- **Added** `shared` api for sharing things between component
- **Added** `propsListener` api for props changes
- **Fixed** when function "drawnDynamic" is called, parent property is set to wrong parent
- **Deprecated** style object in favor of tag style inside template function

## [1.7.2] - 2018-11-01
- **Updated** README

## [1.7.1] - 2018-10-28
- **Fixed** double component during initial rendering when use `mount` method

## [1.7.0] - 2018-10-27
- **Added** new hook `onAfterRender`
- **Added** mixin warning message
- **Improved** `onUpdate` performance
- **Fixed** router example

## [1.6.10] - 2018-10-25
- **Fixed** with `d-is` directive the dashed attributes are not transformed into camelcase

## [1.6.9] - 2018-10-25
- **Fixed** call render method only if rendered to DOM

## [1.6.8] - 2018-10-13
- **Improved** types definition

## [1.6.6] - 2018-10-11
- **Fixed** text is not decoded when reuse textnode element

## [1.6.5] - 2018-10-10
- **Improved** 2x rendering performance
- **Fixed** issue when props is passed as function

## [1.6.4] - 2018-10-04
- **Improved** rendering performance
- **Improved** IE11 compatibility

## [1.6.3] - 2018-10-02
- **Improved** W3C standard

## [1.6.2] - 2018-09-29
- **Added** basic types definition
- **Removed** src folder from npm distribution

## [1.6.1] - 2018-09-18
- **Added** directive `d-is`
- **Removed** unused dev libraries

## [1.6.0] - 2018-09-17
- **Added** `use` to module, a method for define plugins :)
- **Added** app instance events
    - `on` adds a listener given an event name
    - `emit` call an event
- **Added** `autoDraw` property to Doz constructor, by default it's false
- **Added** `draw` method to Doz instance
- **Added** "$this", a special placeholder for indicate "this" of DOM element in listener context
- **Exposed** `compile` function

## [1.5.0] - 2018-09-09
- **Added** class pattern, now it's possible create component with class ES6 syntax
- **Added** new property `config` to component class, available only with class ES6
- **Added** new method `define` to module, alias of `component`
- **Added** `h` an helper that improve virtual dom performance
- **Added** `mixin` for global component to module, now it's possible add external functions to global
- **Added** `mixin` for local component as component property, now it's possible add external functions to local
- **Removed** global namespace `__DOZ_GLOBAL_COMPONENT__`

## [1.4.4] - 2018-08-12
- **Improvement** template engine

## [1.4.3] - 2018-08-02
- **Fixed** scoped style issue with hmr

## [1.4.2] - 2018-08-01
- **Added** compatibility with Parcel HMR (Hot module replacement)

## [1.4.1] - 2018-07-21
- **Improvement** proxy performance

## [1.4.0] - 2018-07-12
- **Breaking changes**
    - Refactored method `style` to `toStyle`
- **Added** property `appRoot` to component instance
- **Added** property `style` to component instance
- **Added** method `getCmp` shorthand reference to `getComponentById`

## [1.3.5] - 2018-07-11
- **Fixed** attributes was removed with falsy value, now only if empty

## [1.3.4] - 2018-07-06
- **Added** new method `style` to component instance

## [1.3.3] - 2018-07-05
- **Fixed** possible root instance issue

## [1.3.2] - 2018-07-04
- **Improvement** event handler, now supports inline logic
- **Fixed** props update issue in constructor

## [1.3.1] - 2018-07-03
- **Fixed** possible undefined target property

## [1.3.0] - 2018-06-30
- **Added** new hook `onMountAsync`
- **Fixed** possible issue on nested update

## [1.2.0] - 2018-06-28
- **Added** new method `getHTMLElement` to component instance

## [1.1.2] - 2018-06-27
- **Improvement** for constructor, now supports all component events

## [1.1.1] - 2018-06-19
- **Fixed** auto-cast issue for numeric argument passed to custom function

## [1.1.0] - 2018-06-18
- **Added** support to local components for components

## [1.0.1] - 2018-06-10
- **Fixed** issue on `beforeDestroy` and `destroy`  that are not called in the child component when parent is destroyed
- **Added** version method `Doz.version`

## [1.0.0] - 2018-06-06
- **Added** new option property `autoCreateChildren` to component definition
- **Added** new property `rawChildren` to component
- **Added** new hook `onBeforeMount`
- **Added** new hook `onMount`
- **Added** new hook `onBeforeUnmount`
- **Added** new hook `onUnmount`
- **Deprecated** hooks `onRender` in favor of `onMount`

## [0.2.0] - 2018-05-23
- **Added** "changes" param to `onBeforeUpdate` and `onUpdate`

## [0.1.0] - 2018-05-22
- **Added** new event `onAppReady`
- **Fixed** update children problem

## [0.0.28] - 2018-05-21
- **Fixed** bind problem on radio input. The initial value was not considered

## [0.0.27] - 2018-05-20
- **Improvement** binding for checkbox and select

## [0.0.26] - 2018-05-18
- **Improvement** dash-case attributes to camel-case props

## [0.0.25] - 2018-05-17
- **Fixed** deep state updating issue
- **Fixed** svg animation start issue

## [0.0.24] - 2018-05-16
- **Improvement** deep state updating
- **Improvement** "d-bind"

## [0.0.23] - 2018-05-13
- **Added** support to SVG element
- **Fixed** issue when inside the template there are no tag element like comment for example

## [0.0.22] - 2018-05-11
- **Cleanup**
- **Added** proxy polyfill

## [0.0.21] - 2018-05-11
- **Improvement** security
- **Fixed** observer issue

## [0.0.20] - 2018-05-09
- **Fixed** xss vulnerability
- **Fixed** infinite loop issue when props are updated inside `onBeforeChange`

## [0.0.19] - 2018-05-06
- First release
