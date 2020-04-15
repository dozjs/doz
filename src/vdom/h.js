const {TAG} = require('../constants');
const mapper = require('./mapper');
const camelToDash = require('../utils/camel-to-dash');
//const eventsAttributes = require('../utils/events-attributes');
const {scopedInner} = require('../component/helpers/style');
const {compile, Element} = require('../vdom/parser');
const tagText = TAG.TEXT_NODE_PLACE;
const tagIterate = TAG.ITERATE_NODE_PLACE;
const LESSER = '<';
const GREATER = '>';

const regOpen = new RegExp(`<${tagText}>(\\s+)?<`, 'gi');
const regClose = new RegExp(`>(\\s+)?<\/${tagText}>`, 'gi');
const regStyle = /<style(?: scoped)?>((?:.|\n)*?)<\/style>/gi;

/**
 * This method add special tag to value placeholder
 * @param strings
 * @param value
 * @returns {*}
 */
module.exports = function (strings, ...value) {

    //hCache.get(strings, value);
    //console.log('val', value);

    // Why? cycling require :D
    //let Component = require('../component/Component');

    let result = strings[0];
    let allowTag = false;
    let isInStyle = false;
    let thereIsStyle = false;
    let isBoundedToComponent = !!this._components;

    for (let i = 0; i < value.length; ++i) {
        let isComponentConstructor = false;
        if (Array.isArray(value[i])) {
            let newValueString = '';
            for (let j = 0; j < value[i].length; j++) {
                let obj = value[i][j];
                if(typeof obj === 'object' && obj.constructor && obj.constructor === Element) {
                    newValueString += `<${tagIterate}>${mapper.set(obj)}</${tagIterate}>`;
                }
            }
            if (newValueString)
                value[i] = newValueString;
        }

        if(value[i] !== null && typeof value[i] === 'object' && value[i].constructor && value[i].constructor === Element) {
            value[i] = mapper.set(value[i]);
        }

        //console.log(strings[i].split(''));
        //console.log([...strings[i]]);

        for (let x = 0; x < strings[i].length; x++) {
            let char = strings[i][x];
            if (char === LESSER)
                allowTag = false;
            if (char === GREATER)
                allowTag = true;
        }

        /*strings[i].split('').forEach(char => {
            //console.log(char)
            if (char === LESSER)
                allowTag = false;
            if (char === GREATER)
                allowTag = true;
        });*/


        if (strings[i].indexOf('<style') > -1) {
            isInStyle = true;
            thereIsStyle = true;
        }

        if (strings[i].indexOf('</style') > -1) {
            isInStyle = false;
        }

        if(isInStyle) {
            allowTag = false;
            result = result
                .replace(/ scoped>/, ' data-scoped>');
        }

        //
        let isInHandler = false;
        // Check if value is a function and is after an event attribute like onclick for example.
        if (typeof value[i] === 'function' || typeof value[i] === 'object') {
            //for (let x = 0; x < eventsAttributes.length; x++) {
                let r = strings[i].split(`=`);
                if (['"', "'", ''].indexOf(r[r.length - 1]) > -1) {
                    isInHandler = true;
                }
            //}
        }

        //console.log(isInHandler, value[i]);

        // if this function is bound to Doz component
        if (isBoundedToComponent && !isInStyle && !isInHandler) {

            // if before is to <
            if (value[i] && !Array.isArray(value[i]) && (typeof value[i] === 'function' || typeof value[i] === 'object') && strings[i].indexOf(LESSER) > -1) {
                isComponentConstructor = true;
                let cmp = value[i];
                let tagName = camelToDash(cmp.tag || cmp.name || 'obj');
                // Sanitize tag name
                tagName = tagName.replace(/_+/, '');
                // if is a single word, rename with double word
                if (tagName.indexOf('-') === -1) {
                    tagName = `${tagName}-${tagName}`;
                }

                let tagCmp = tagName + '-' + this.uId + '-' + (this._localComponentLastId++);



                if (this._componentsMap.has(value[i])) {
                    tagCmp = this._componentsMap.get(value[i]);
                } else {
                    this._componentsMap.set(value[i], tagCmp);
                }

                // add to local components
                if (this._components[tagCmp] === undefined) {
                    this._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }

                // add to local app components
                if (this.app._components[tagCmp] === undefined) {
                    this.app._components[tagCmp] = {
                        tag: tagName,
                        cfg: cmp
                    };
                }
                //console.log('---------->', tagCmp);
                value[i] = tagCmp;
            }
        }

        if(allowTag) {
            //console.log('aaaaaaaaaaaaaaaaddd', tagText, value[i])
            result += `<${tagText}>${value[i]}</${tagText}>${strings[i + 1]}`;
        } else {
            // If is not component constructor then add to map.
            // Exclude string type and style also
            //console.log(!isInStyle, !isComponentConstructor, typeof value[i] !== 'string', value[i])
            if (!isInStyle && !isComponentConstructor && typeof value[i] !== 'string') {
                value[i] = mapper.set(value[i]);
            }
            result += `${value[i]}${strings[i + 1]}`;
        }
    }

    // Funziona anche senza?
    /*
            result = result
                .replace(regOpen, LESSER)
                .replace(regClose, GREATER);*/


    // Prima crea l'elemento e poi mette lo stile, dando un effetto poco piacevole, meglio lasciare
    // il tag script con il tipo text/style
    /*
    if (isBoundedToComponent) {
        // Now get style from complete string
        if (thereIsStyle)
            result = result.replace(regStyle, (match, p1) => {
                if (!this._rootElement || p1 === this._currentStyle) return '';
                if (match && p1) {
                    // Here should be create the tag style
                    this._currentStyle = p1;
                    let isScoped = /scoped/.test(match);
                    const dataSetUId = this.uId;
                    this.getHTMLElement().dataset.uid = this.uId;
                    let tagByData = `[data-uid="${dataSetUId}"]`;

                    scopedInner(this._currentStyle, dataSetUId, tagByData, isScoped);
                }

                return '';
            });
    }
    */

    result = result.trim();
    //console.log(result);

    result = compile(result);

    //console.log(result)
    //console.log(mapCompiled.data)
    return result;
};
