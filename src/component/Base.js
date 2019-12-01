class Base {

    constructor(opt = {}) {
        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };

        opt.app = opt.app || {};

        Object.defineProperties(this, {
            //Private
            _opt: {
                value: opt
            },
            _cfgRoot: {
                value: opt.root
            },
            _publicProps: {
                value: Object.assign({}, opt.props)
            },
            _isRendered: {
                value: false,
                writable: true
            },
            _prev: {
                value: null,
                writable: true
            },
            _rootElement: {
                value: null,
                writable: true
            },
            _parentElement: {
                value: null,
                writable: true
            },
            _components: {
                value: {},
                writable: true
            },
            _processing: {
                value: [],
                writable: true
            },
            _dynamicChildren: {
                value: [],
                writable: true
            },
            _unmounted: {
                value: false,
                writable: true
            },
            _unmountedParentNode: {
                value: null,
                writable: true
            },
            _configured: {
                value: false,
                writable: true
            },
            _props: {
                value: {},
                writable: true
            },
            _directiveProps: {
                value: {},
                writable: true
            },
            _computedCache: {
                value: new Map()
            },
            _renderPause: {
                value: false,
                writable: true
            },
            _rawHTML: {
                value: '',
                writable: true
            },
            _slots: {
                value: {},
                writable: true
            },
            _defaultSlot: {
                value: null,
                writable: true
            },
            _localComponentLastId: {
                value: 0,
                writable: true
            },
            _currentStyle: {
                value: '',
                writable: true
            },
            _componentsMap: {
                value: new Map()
            },

            //Public
            tag: {
                value: opt.cmp.tag,
                enumerable: true
            },
            /*uId: {
                value: opt.uId,
                enumerable: true
            },*/
            app: {
                value: opt.app,
                enumerable: true
            },
            parent: {
                value: opt.parentCmp,
                enumerable: true,
                configurable: true
            },
            appRoot: {
                value: opt.app._root,
                enumerable: true
            },
            action: {
                value: opt.app.action,
                enumerable: true
            },
            shared: {
                value: opt.app.shared,
                writable: true,
                enumerable: true
            },
            children: {
                value: {},
                enumerable: true
            },
            childrenByTag: {
                value: {},
                enumerable: true
            },
            rawChildren: {
                value: [],
                enumerable: true
            },
            autoCreateChildren: {
                value: true,
                enumerable: true,
                writable: true
            },
            updateChildrenProps: {
                value: true,
                enumerable: true,
                writable: true
            },
            mixin: {
                value: [],
                enumerable: true,
                writable: true
            },
            propsConvertOnFly: {
                value: false,
                enumerable: true,
                writable: true
            },
            propsComputedOnFly: {
                value: false,
                enumerable: true,
                writable: true
            },
            delayUpdate: {
                value: 0,
                enumerable: true,
                writable: true
            },
            propsData: {
                value: {},
                enumerable: true,
                writable: true
            },
            lockRemoveInstanceByCallback: {
                value: null,
                enumerable: true,
                writable: true
            }
        });
    }
}

module.exports = Base;