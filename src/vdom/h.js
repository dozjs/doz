import { TAG } from "../constants.js";
import camelToDash from "../utils/camelToDash.js";
import deepCopy from "../utils/deepCopy.js";
import { compile } from "./parser.js";
import cacheStores from "./stores.js";
const tagText = TAG.TEXT_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';
const PLACEHOLDER_REGEX_GLOBAL = /e-0_(\d+)_0-e/g;
const PLACEHOLDER_REGEX = /e-0_(\d+)_0-e/;
function placeholderIndex(str, values) {
    //console.log(str)
    if (typeof str !== 'string') {
        return str;
    }
    if (str[0] === 'e' && str[1] === '-') {
        let match = PLACEHOLDER_REGEX.exec(str);
        if (match) {
            // if is a possible text node
            if (match[1][0] === '0' && match[1].length >= 2) {
                // remove first fake 0 that identify a text node and cast to string every
                return values[match[1].substring(1)] + '';
            }
            else {
                return values[match[1]];
            }
        }
        else
            return str;
    }
    else {
        return str.replace(PLACEHOLDER_REGEX_GLOBAL, (match, p1) => {
            if (p1) {
                return values[p1];
            }
            else {
                return match;
            }
        });
    }
}
function generateItemKey(values) {
    let key = '';
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== 'function' && typeof values[i] !== 'object') {
            key += values[i];
        }
    }
    //console.log(key);
    return key;
}
function fillCompiled(obj, values, parent, _this) {
    let keys = Object.keys(obj);
    if (obj.__spreadprops) {
        let indexOfSpreadPropsObj = 0;
        for (let i = 0; i < values.length; i++) {
            if (typeof values[i] === 'object') {
                indexOfSpreadPropsObj = i;
                break;
            }
        }
        for (let o in values[indexOfSpreadPropsObj]) {
            obj[o] = values[indexOfSpreadPropsObj][o];
        }
        delete obj.__spreadprops;
    }
    for (let i = 0; i < keys.length; i++) {
        //for (let k in obj) {
        if (obj[keys[i]] && typeof obj[keys[i]] === 'object') {
            fillCompiled(obj[keys[i]], values, obj, _this);
        }
        else {
            //console.log(i, keys[i])
            let value = placeholderIndex(obj[keys[i]], values);
            //if (typeof value === 'function' && keys[i] === 'type') {
            if ('type' === keys[i] && 'string' !== typeof value) {
                let cmp = value || {};
                let tagName = camelToDash(cmp.tag || cmp.name || TAG.ROOT);
                // Sanitize tag name
                tagName = tagName.replace(/_+/, '');
                // if is a single word, rename with double word
                if (tagName.indexOf('-') === -1) {
                    tagName = `${tagName}-${tagName}`;
                }
                let tagCmp = tagName + '-' + _this.uId + '-' + (_this._localComponentLastId++);
                if (_this._componentsMap.has(value)) {
                    tagCmp = _this._componentsMap.get(value);
                }
                else {
                    _this._componentsMap.set(value, tagCmp);
                }
                // add to local components
                if (_this._components[tagCmp] === undefined) {
                    _this._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }
                // add to local app components
                if (_this.app._components[tagCmp] === undefined) {
                    _this.app._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }
                value = tagName;
                obj.props['data-attributeoriginaletagname'] = tagCmp;
                if (cmp.suspendContent) {
                    obj.props['suspendcontent'] = true;
                    obj.props['suspendcontent_by_parent'] = true;
                }
            }
            if (Array.isArray(value) && keys[i] === '0') {
                parent.children = value;
                if (value[0] && value[0].key !== undefined)
                    parent.hasKeys = true;
            }
            else {
                // questo evita stringhe vuote che potrebbero causare visualizzazioni errate
                if (value === '' && keys[i] === '0') {
                    value = ' ';
                }
                obj[keys[i]] = value;
            }
        }
    }
}
export default (function (strings, ...values) {
    let hCache;
    let kCache;
    let isStyleForWebComponentByAppCreate;
    // use internal app cache stores
    if (this && this.app) {
        hCache = this.app.cacheStores.hCache;
        kCache = this.app.cacheStores.kCache;
        isStyleForWebComponentByAppCreate = this.app.isWebComponent && this._mainComponentByAppCreate;
    }
    else {
        // use global cache stores
        hCache = cacheStores.hCache;
        kCache = cacheStores.kCache;
    }
    let tpl = hCache.get(strings);
    //console.log(this.app.appIntId);
    //console.log(strings);
    //let appIntId = this.app.appIntId;
    if (!tpl) {
        //console.log(strings[0])
        tpl = strings[0];
        let allowTag = false;
        let isInStyle = false;
        let thereIsStyle = false;
        let valueLength = values.length;
        for (let i = 0; i < valueLength; ++i) {
            let stringsI = strings[i];
            let stringLength = stringsI.length;
            let lastChar = stringsI[stringLength - 1];
            for (let x = 0; x < stringLength; x++) {
                if (stringsI[x] === LESSER) {
                    allowTag = false;
                }
                else if (stringsI[x] === GREATER) {
                    allowTag = true;
                }
            }
            if (stringsI.indexOf('<style') > -1) {
                isInStyle = true;
                thereIsStyle = true;
            }
            if (stringsI.indexOf('</style') > -1) {
                isInStyle = false;
            }
            if (thereIsStyle && isStyleForWebComponentByAppCreate) {
                tpl = tpl
                    .replace(/<style>/, '<style data-is-webcomponent>');
            }
            if (isInStyle) {
                allowTag = false;
                tpl = tpl
                    .replace(/ scoped>/, ' data-scoped>');
            }
            if (allowTag) {
                if (typeof values[i] === 'object' || typeof values[i] === 'function') {
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                }
                else {
                    // Questo serve ad evitare che "oldNode" o "newNode" siano stringhe vuote
                    // dal momento che se un placeholder allora anche il suo corrispettivo
                    // nodo di testo dev'essere creato o modificato.
                    // Senza questo eventuali strighe vuote potevano non essere considerate.
                    if (values[i] === '') {
                        values[i] = ' ';
                    }
                    // possible html as string
                    if (/<.*>/.test(values[i])) {
                        tpl += `${values[i]}${strings[i + 1]}`;
                    }
                    else {
                        // add a fake 0 before index useful to identify a text node so cast to string every
                        tpl += `<${tagText}>e-0_0${i}_0-e</${tagText}>${strings[i + 1]}`;
                    }
                }
            }
            else {
                // Gestico eventuale caso di chiusura tag con placeholder
                // tipo: </${FooBar}>
                if (lastChar === '/') {
                    tpl += strings[i + 1];
                }
                else {
                    tpl += `e-0_${i}_0-e${strings[i + 1]}`;
                }
            }
        }
        tpl = tpl.trim();
        hCache.set(strings, tpl);
    }
    //console.log('TPL ------>', tpl)
    let cloned;
    let model = compile(tpl);
    let clonedKey;
    if (model.props.forceupdate) {
        hCache.delete(strings);
    }
    if (model.key !== undefined || model.props['item-list'] !== undefined) {
        //clonedKey = values.filter(item => typeof item !== 'function' && typeof item !== 'object').join('');
        clonedKey = generateItemKey(values);
        cloned = clonedKey ? hCache.get(clonedKey) : undefined;
    }
    if (!cloned) {
        cloned = deepCopy(model);
        fillCompiled(cloned, values, null, this);
        if (clonedKey) {
            hCache.set(clonedKey, cloned);
        }
    }
    if (model.key !== undefined) {
        let _kCacheValue = kCache.get(cloned.key);
        if (_kCacheValue /*&& clonedKey !== _kCacheValue.clonedKey*/) {
            kCache.set(cloned.key, {
                isChanged: clonedKey !== _kCacheValue.clonedKey,
                //isChanged: true,
                clonedKey,
                next: cloned,
                prev: _kCacheValue.next
            });
        }
        else {
            kCache.set(cloned.key, {
                isChanged: true,
                clonedKey,
                next: cloned,
                prev: {}
            });
        }
    }
    //console.log('CLN ------>', cloned)
    return cloned;
});
