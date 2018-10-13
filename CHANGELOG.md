# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.6.7] - 2018-10-13
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
