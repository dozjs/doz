# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2018-05-22
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
