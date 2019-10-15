const cloneObject = require('../utils/clone-object');
const toLiteralString = require('../utils/to-literal-string');
const detectInheritance = require('../utils/detect-inheritance');
const {REGEX} = require('../constants');

class Base {
    constructor(opt = {}) {
        Object.defineProperties(this, {
            _isSubclass: {
                //value: detectInheritance(this.__proto__, Base)
                value: this.__proto__.constructor !== Base
            },
            _rawProps: {
                value: {},
                writable: true
            }
        });

        opt.cmp = opt.cmp || {
            tag: opt.tag,
            cfg: {}
        };

        opt.app = opt.app || {};

        this._initRawProps(opt);

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
            _initialProps: {
                value: cloneObject(this._rawProps)
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

            //Public
            tag: {
                value: opt.cmp.tag,
                enumerable: true
            },
            uId: {
                value: opt.uId,
                enumerable: true
            },
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
            }
        });
    }

    // noinspection JSMethodCanBeStatic
    template() {
        return '';
    }

    _initTemplate(opt) {
        if (typeof opt.cmp.cfg.template === 'string' && opt.app.cfg.enableExternalTemplate) {
            let contentTpl = opt.cmp.cfg.template;
            if (REGEX.IS_ID_SELECTOR.test(contentTpl)) {
                opt.cmp.cfg.template = function () {
                    let contentStr = toLiteralString(document.querySelector(contentTpl).innerHTML);
                    return eval('`' + contentStr + '`')
                }
            } else {
                opt.cmp.cfg.template = function () {
                    contentTpl = toLiteralString(contentTpl);
                    return eval('`' + contentTpl + '`');
                }
            }
        }
    }

    _initRawProps(opt) {
        //console.log(this._isSubclass)
        if (!this._isSubclass) {
            this._rawProps = Object.assign({},
                typeof opt.cmp.cfg.props === 'function'
                    ? opt.cmp.cfg.props()
                    : opt.cmp.cfg.props,
                opt.props
            );

            this._initTemplate(opt);

        } else {
            this._rawProps = Object.assign({}, opt.props);
        }
    }
}

module.exports = Base;