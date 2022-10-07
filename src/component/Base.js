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
        this._directiveProps = null;
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

    }
}
export default Base;
