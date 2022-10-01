class Base {
    constructor(opt = {}) {
        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };
        opt.app = opt.app || {};
        this._opt = opt;
        this._cfgRoot = opt.root;
        this._publicProps = Object.assign({}, opt.props);
        this._isRendered = false;
        this._prev = null;
        this._rootElement = null;
        this._parentElement = null;
        this._components = {};
        this._processing = [];
        this._dynamicChildren = [];
        this._unmounted = false;
        this._unmountedParentNode = null;
        this._configured = false;
        this._props = {};
        this._directiveProps = {};
        this._computedCache = new Map();
        this._renderPause = false;
        this._rawHTML = '';
        this._hasSlots = false;
        this._slots = {};
        this._defaultSlot = null;
        this._localComponentLastId = 0;
        this._currentStyle = '';
        this._componentsMap = new Map();
        this.tag = opt.cmp.tag;
        this.app = opt.app;
        this.exposeAttributes = ['style', 'class'];
        this.parent = opt.parentCmp;
        this.appRoot = opt.app._root;
        this.action = opt.app.action;
        this.shared = opt.app.shared;
        this.childrenToWalk = [];
        this._childrenInc = 0;
        this.children = {};
        this.childrenByTag = {};
        this.rawChildren = [];
        this.rawChildrenVnode = [];
        this.autoCreateChildren = true;
        this.updateChildrenProps = true;
        this.mixin = [];
        this.propsConvertOnFly = false;
        this.propsComputedOnFly = false;
        this.delayUpdate = 0;
        this.propsData = {};
        this.lockRemoveInstanceByCallback = null;
        this.waitMount = false;
/*
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
            _hasSlots: {
                value: false,
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
                enumerable: true,
                writable: true
            },
            app: {
                value: opt.app,
                enumerable: true
            },
            exposeAttributes: {
                value: ['style', 'class'],
                enumerable: true,
                writable: true
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
            childrenToWalk: {
                value: [],
                enumerable: true
            },
            _childrenInc: {
                value: 0,
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
            rawChildrenVnode: {
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
            },
            waitMount: {
                value: false,
                enumerable: true,
                writable: true
            }
        });
*/

    }
}
export default Base;
