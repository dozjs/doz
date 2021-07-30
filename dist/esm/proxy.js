import delay from "./utils/delay.js";
import stringDecoder from "./utils/string-decoder.js";
/**
 * ObservableSlim
 * @type {{create, observe, remove, beforeChange, beginRender, endRender}}
 */
const ObservableSlim = (function () {
    // An array that stores all of the observables created through the public create() method below.
    let observables = [];
    // An array of all the objects that we have assigned Proxies to
    let targets = [];
    // An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
    // 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object
    let targetsProxy = [];
    // this variable tracks duplicate proxies assigned to the same target.
    // the 'set' handler below will trigger the same change on all other Proxies tracking the same target.
    // however, in order to avoid an infinite loop of Proxies triggering and re-triggering one another, we use dupProxy
    // to track that a given Proxy was modified from the 'set' handler
    let dupProxy = null;
    let _getProperty = function (obj, path) {
        return path.split('.').reduce(function (prev, curr) {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    };
    /**
     * _create
     * @description Private internal function that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
     * @param target {Object} required, plain JavaScript object that we want to observe for changes.
     * @param domDelay {Boolean|Null} batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
     * @param originalObservable {Object} the original observable created by the user, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
     * @param originalPath {String} the path of the property in relation to the target on the original observable, exists for recursion purposes, allows one observable to observe change on any nested/child objects.
     * @returns {Object}
     * @private
     */
    let _create = function (target, domDelay, originalObservable, originalPath) {
        let autoDomDelay = domDelay == null;
        let observable = originalObservable || null;
        let path = originalPath || '';
        let changes = [];
        let _getPath = function (target, property) {
            if (target instanceof Array) {
                return (path !== '') ? (path) : property;
            }
            else {
                return (path !== '') ? (path + '.' + property) : property;
            }
        };
        let calls = 0;
        let _notifyObservers = function (numChanges) {
            if (observable.paused === true)
                return;
            // reset calls number after 10ms
            if (autoDomDelay) {
                domDelay = ++calls > 1;
                delay(function () {
                    calls = 0;
                });
            }
            //domDelay = false;
            // execute observer functions on a 10ms setTimeout, this prevents the observer functions from being executed
            // separately on every change -- this is necessary because the observer functions will often trigger UI updates
            if (domDelay === true /*&& !observable.disableDOMDelay*/) {
                delay(function () {
                    if (numChanges === changes.length) {
                        // invoke any functions that are observing changes
                        for (let i = 0; i < observable.observers.length; i++)
                            observable.observers[i](changes);
                        changes = [];
                    }
                });
            }
            else {
                // invoke any functions that are observing changes
                //console.log(numChanges, changes.length, observable.observers.length)
                //console.log(changes)
                for (let i = 0; i < observable.observers.length; i++)
                    observable.observers[i](changes);
                changes = [];
            }
        };
        let handler = {
            get: function (target, property) {
                // implement a simple check for whether or not the object is a proxy, this helps the .create() method avoid
                // creating Proxies of Proxies.
                if (property === '__getTarget') {
                    return target;
                }
                else if (property === '__isProxy') {
                    return true;
                    // from the perspective of a given observable on a parent object, return the parent object of the given nested object
                }
                else if (property === '__getParent') {
                    return function (i) {
                        if (typeof i === 'undefined')
                            i = 1;
                        let parentPath = _getPath(target, '__getParent').split('.');
                        parentPath.splice(-(i + 1), (i + 1));
                        return _getProperty(observable.parentProxy, parentPath.join('.'));
                    };
                }
                // return the full path of the current object relative to the parent observable
                else if (property === '__getPath') {
                    // strip off the 12 characters for ".__getParent"
                    let parentPath = _getPath(target, '__getParent');
                    return parentPath.slice(0, -12);
                }
                // for performance improvements, we assign this to a variable so we do not have to lookup the property value again
                let targetProp = target[property];
                //console.log('èèèèèèèèèèèèèèèèèèèè', targetProp instanceof Date)
                if (target instanceof Date && targetProp instanceof Function) {
                    return targetProp.bind(target);
                }
                // if we are traversing into a new object, then we want to record path to that object and return a new observable.
                // recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
                // the target object and any objects nested within.
                if ((targetProp instanceof Object) && target.hasOwnProperty(property)) {
                    // if we've found a proxy nested on the object, then we want to retrieve the original object behind that proxy
                    if (targetProp.__isProxy === true)
                        targetProp = targetProp.__getTarget;
                    // if we've previously setup a proxy on this target, then...
                    //let a = observable.targets.indexOf(targetProp);
                    //console.log('',a);
                    let a = -1;
                    let observableTargets = observable.targets;
                    for (let i = 0, l = observableTargets.length; i < l; i++) {
                        if (targetProp === observableTargets[i]) {
                            //console.log('aaaaa', i)
                            a = i;
                            break;
                        }
                    }
                    //console.log('get')
                    if (a > -1)
                        return observable.proxies[a];
                    //console.log('oooo')
                    // if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
                    // have to create a new proxy for it
                    let newPath = (path !== '') ? (path + '.' + property) : property;
                    return _create(targetProp, domDelay, observable, newPath);
                }
                else {
                    let value = observable.renderMode ? stringDecoder.encode(targetProp) : targetProp;
                    let manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, property, true);
                    }
                    return value;
                }
            },
            deleteProperty: function (target, property) {
                // was this change an original change or was it a change that was re-triggered below
                let originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }
                // in order to report what the previous value was, we must make a copy of it before it is deleted
                let previousValue = Object.assign({}, target);
                // get the path of the property being deleted
                let currentPath = _getPath(target, property);
                if (!observable.paused) {
                    // record the deletion that just took place
                    changes.push({
                        type: 'delete',
                        target: target,
                        property: property,
                        newValue: null,
                        previousValue: previousValue[property],
                        currentPath: currentPath,
                        proxy: proxy
                    });
                    //console.log('delete', changes)
                    if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
                        observable.checkBeforeChange = currentPath;
                        let res = observable.beforeChange(changes);
                        if (res === false) {
                            observable.checkBeforeChange = '';
                            return false;
                        }
                    }
                    observable.checkBeforeChange = '';
                }
                if (originalChange === true) {
                    let a, l;
                    for (a = 0, l = targets.length; a < l; a++)
                        if (target === targets[a])
                            break;
                    // loop over each proxy and see if the target for this change has any other proxies
                    let currentTargetProxy = targetsProxy[a] || [];
                    let b = currentTargetProxy.length;
                    while (b--) {
                        // if the same target has a different proxy
                        if (currentTargetProxy[b].proxy !== proxy) {
                            // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                            // prevent a change on dupProxy from re-triggering the same change on other proxies)
                            dupProxy = currentTargetProxy[b].proxy;
                            // make the same delete on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                            // on any other proxies so that the previousValue can show up correct for the other proxies
                            delete currentTargetProxy[b].proxy[property];
                        }
                    }
                    // perform the delete that we've trapped
                    delete target[property];
                }
                _notifyObservers(changes.length);
                return true;
            },
            set: function (target, property, value, receiver) {
                // was this change an original change or was it a change that was re-triggered below
                let originalChange = true;
                if (dupProxy === proxy) {
                    originalChange = false;
                    dupProxy = null;
                }
                // improve performance by saving direct references to the property
                let targetProp = target[property];
                // only record a change if the new value differs from the old one OR if this proxy was not the original proxy to receive the change
                if (targetProp !== value || originalChange === false) {
                    //console.dir(target)
                    let typeOfTargetProp = (typeof targetProp);
                    // get the path of the object property being modified
                    let currentPath = _getPath(target, property);
                    // determine if we're adding something new or modifying some that already existed
                    let type = 'update';
                    if (typeOfTargetProp === 'undefined')
                        type = 'add';
                    let manipulate = observable.manipulate;
                    if (typeof manipulate === 'function') {
                        value = manipulate(value, currentPath, false);
                    }
                    // store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct
                    if (!observable.paused) {
                        changes.push({
                            type: type,
                            target: target,
                            property: property,
                            newValue: value,
                            previousValue: receiver[property],
                            currentPath: currentPath,
                            proxy: proxy
                        });
                        if (typeof observable.beforeChange === 'function' && observable.checkBeforeChange !== currentPath) {
                            observable.checkBeforeChange = currentPath;
                            let res = observable.beforeChange(changes);
                            if (res === false) {
                                observable.checkBeforeChange = '';
                                return false;
                            }
                        }
                        observable.checkBeforeChange = '';
                    }
                    // !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
                    // if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
                    // observers can be modified of the change that has occurred.
                    if (originalChange === true) {
                        let a, l;
                        for (a = 0, l = targets.length; a < l; a++)
                            if (target === targets[a])
                                break;
                        // loop over each proxy and see if the target for this change has any other proxies
                        let currentTargetProxy = targetsProxy[a];
                        if (currentTargetProxy)
                            for (let b = 0, l = currentTargetProxy.length; b < l; b++) {
                                // if the same target has a different proxy
                                if (currentTargetProxy[b].proxy !== proxy) {
                                    // !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
                                    // prevent a change on dupProxy from re-triggering the same change on other proxies)
                                    dupProxy = currentTargetProxy[b].proxy;
                                    // invoke the same change on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
                                    // on any other proxies so that the previousValue can show up correct for the other proxies
                                    currentTargetProxy[b].proxy[property] = value;
                                }
                            }
                        // if the property being overwritten is an object, then that means this observable
                        // will need to stop monitoring this object and any nested objects underneath the overwritten object else they'll become
                        // orphaned and grow memory usage. we excute this on a setTimeout so that the clean-up process does not block
                        // the UI rendering -- there's no need to execute the clean up immediately
                        /*
                        setTimeout(function () {

                            if (typeOfTargetProp === 'object' && targetProp !== null) {

                                // check if the to-be-overwritten target property still exists on the target object
                                // if it does still exist on the object, then we don't want to stop observing it. this resolves
                                // an issue where array .sort() triggers objects to be overwritten, but instead of being overwritten
                                // and discarded, they are shuffled to a new position in the array
                                let keys = Object.keys(target);
                                for (let i = 0, l = keys.length; i < l; i++) {
                                    if (target[keys[i]] === targetProp) {
                                        //console.log('target still exists');
                                        return;
                                    }
                                }


                                let stillExists = false;

                                // now we perform the more expensive search recursively through the target object.
                                // if we find the targetProp (that was just overwritten) still exists somewhere else
                                // further down in the object, then we still need to observe the targetProp on this observable.
                                (function iterate(target) {
                                    const keys = Object.keys(target);
                                    let i = 0, l = keys.length;
                                    for (; i < l; i++) {

                                        const property = keys[i];
                                        const nestedTarget = target[property];

                                        if (nestedTarget instanceof Object) iterate(nestedTarget);
                                        if (nestedTarget === targetProp) {
                                            stillExists = true;
                                            return;
                                        }
                                    }
                                })(target);

                                // even though targetProp was overwritten, if it still exists somewhere else on the object,
                                // then we don't want to remove the observable for that object (targetProp)
                                if (stillExists === true) return;

                                // loop over each property and recursively invoke the `iterate` function for any
                                // objects nested on targetProp
                                (function iterate(obj) {

                                    let keys = Object.keys(obj);
                                    for (let i = 0, l = keys.length; i < l; i++) {
                                        let objProp = obj[keys[i]];
                                        if (objProp instanceof Object) iterate(objProp);
                                    }

                                    // if there are any existing target objects (objects that we're already observing)...
                                    //let c = targets.indexOf(obj);
                                    let c = -1;
                                    for (let i = 0, l = targets.length; i < l; i++) {
                                        if (obj === targets[i]) {
                                            c = i;
                                            break;
                                        }
                                    }
                                    if (c > -1) {

                                        // ...then we want to determine if the observables for that object match our current observable
                                        let currentTargetProxy = targetsProxy[c];
                                        let d = currentTargetProxy.length;

                                        while (d--) {
                                            // if we do have an observable monitoring the object thats about to be overwritten
                                            // then we can remove that observable from the target object
                                            if (observable === currentTargetProxy[d].observable) {
                                                currentTargetProxy.splice(d, 1);
                                                break;
                                            }
                                        }

                                        // if there are no more observables assigned to the target object, then we can remove
                                        // the target object altogether. this is necessary to prevent growing memory consumption particularly with large data sets
                                        if (currentTargetProxy.length === 0) {
                                            targets[c] = null;
                                            //targetsProxy.splice(c, 1);
                                            //targets.splice(c, 1);
                                        }
                                    }

                                })(targetProp)
                            }
                        }, 10000);
                        */
                        // because the value actually differs than the previous value
                        // we need to store the new value on the original target object
                        target[property] = value;
                        // TO DO: the next block of code resolves test case #24, but it results in poor IE11 performance. Find a solution.
                        // if the value we've just set is an object, then we'll need to iterate over it in order to initialize the
                        // observers/proxies on all nested children of the object
                        if (value instanceof Object && value !== null) {
                            (function iterate(proxy) {
                                let target = proxy.__getTarget;
                                let keys = Object.keys(target);
                                for (let i = 0, l = keys.length; i < l; i++) {
                                    let property = keys[i];
                                    if (target[property] instanceof Object && target[property] !== null)
                                        iterate(proxy[property]);
                                }
                            })(proxy[property]);
                        }
                    }
                    // notify the observer functions that the target has been modified
                    _notifyObservers(changes.length);
                }
                return true;
            }
        };
        // create the proxy that we'll use to observe any changes
        let proxy = new Proxy(target, handler);
        // we don't want to create a new observable if this function was invoked recursively
        if (observable === null) {
            observable = {
                parentTarget: target,
                domDelay: domDelay,
                parentProxy: proxy,
                observers: [],
                targets: [target],
                proxies: [proxy],
                path: path
            };
            observables.push(observable);
        }
        else {
            observable.targets.push(target);
            observable.proxies.push(proxy);
        }
        // store the proxy we've created so it isn't re-created unnecessary via get handler
        let proxyItem = { target, proxy, observable };
        //let targetPosition = targets.indexOf(target);
        let targetPosition = -1;
        for (let i = 0, l = targets.length; i < l; i++) {
            if (target === targets[i]) {
                targetPosition = i;
                break;
            }
        }
        // if we have already created a Proxy for this target object then we add it to the corresponding array
        // on targetsProxy (targets and targetsProxy work together as a Hash table indexed by the actual target object).
        if (targetPosition > -1) {
            targetsProxy[targetPosition].push(proxyItem);
            // else this is a target object that we have not yet created a Proxy for, so we must add it to targets,
            // and push a new array on to targetsProxy containing the new Proxy
        }
        else {
            targets.push(target);
            targetsProxy.push([proxyItem]);
        }
        return proxy;
    };
    return {
        /**
         * Create
         * @description Public method that is invoked to create a new ES6 Proxy whose changes we can observe through the Observerable.observe() method.
         * @param target {Object} required, plain JavaScript object that we want to observe for changes.
         * @param domDelay {Boolean} if true, then batch up changes on a 10ms delay so a series of changes can be processed in one DOM update.
         * @param observer {Function} optional, will be invoked when a change is made to the proxy.
         * @param iterateBeforeCreate
         * @returns {Object}
         */
        create: function (target, domDelay, observer, iterateBeforeCreate) {
            // test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
            // we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
            if (target.__isProxy === true) {
                target = target.__getTarget;
                //if it is, then we should throw an error. we do not allow creating proxies of proxies
                // because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
                //throw new Error('ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.');
            }
            // fire off the _create() method -- it will create a new observable and proxy and return the proxy
            let proxy = _create(target, domDelay);
            // assign the observer function
            if (typeof observer === 'function')
                this.observe(proxy, observer);
            // recursively loop over all nested objects on the proxy we've just created
            // this will allow the top observable to observe any changes that occur on a nested object
            (function iterate(proxy) {
                let target = proxy.__getTarget;
                let keys = Object.keys(target);
                for (let i = 0, l = keys.length; i < l; i++) {
                    let property = keys[i];
                    if (typeof iterateBeforeCreate === 'function') {
                        iterateBeforeCreate(target, property);
                    }
                    if (target[property] instanceof Object && target[property] !== null)
                        iterate(proxy[property]);
                }
            })(proxy);
            return proxy;
        },
        /**
         * observe
         * @description This method is used to add a new observer function to an existing proxy.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method. We want to observe changes made to this object.
         * @param observer {Function} this function will be invoked when a change is made to the observable (not to be confused with the observer defined in the create() method).
         */
        observe: function (proxy, observer) {
            // loop over all the observables created by the _create() function
            let i = observables.length;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].observers.push(observer);
                    break;
                }
            }
        },
        /**
         * Remove
         * @description this method will remove the observable and proxy thereby preventing any further callback observers for changes occuring to the target object.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method
         */
        remove: function (proxy) {
            let matchedObservable = null;
            let foundMatch = false;
            let c = observables.length;
            while (c--) {
                if (observables[c].parentProxy === proxy) {
                    matchedObservable = observables[c];
                    foundMatch = true;
                    break;
                }
            }
            let a = targetsProxy.length;
            while (a--) {
                let b = targetsProxy[a].length;
                while (b--) {
                    if (targetsProxy[a][b].observable === matchedObservable) {
                        targetsProxy[a].splice(b, 1);
                        if (targetsProxy[a].length === 0) {
                            // if there are no more proxies for this target object
                            // then we null out the position for this object on the targets array
                            // since we are essentially no longer observing this object.
                            // we do not splice it off the targets array, because if we re-observe the same
                            // object at a later time, the property __targetPosition cannot be redefined.
                            targets[a] = null;
                            /*targetsProxy.splice(a, 1);
                            targets.splice(a, 1);*/
                        }
                    }
                }
            }
            if (foundMatch === true) {
                observables.splice(c, 1);
            }
        },
        /**
         * manipulate
         * @description This method allows manipulation data.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        manipulate: function (proxy, callback) {
            if (typeof callback !== 'function')
                throw new Error('callback is required');
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].manipulate = callback;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * beforeChange
         * @description This method accepts a function will be invoked before changes.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         * @param callback {Function} will be invoked before every change is made to the proxy, if it returns false no changes will be made.
         */
        beforeChange: function (proxy, callback) {
            if (typeof callback !== 'function')
                throw new Error('callback is required');
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].beforeChange = callback;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * beginRender
         * @description This method set renderMode to true so the param in get is sanitized.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        beginRender: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = true;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * endRender
         * @description This method set renderMode to false.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        endRender: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].renderMode = false;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error('proxy not found.');
        },
        /**
         * disableDOMDelayBegin
         * @description This method set disableDOMDelay to true.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        /*disableDOMDelayBegin: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].disableDOMDelay = true;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
        },*/
        /**
         * disableDOMDelayEnd
         * @description This method set disableDOMDelay to false.
         * @param proxy {Proxy} the ES6 Proxy returned by the create() method.
         */
        /*disableDOMDelayEnd: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].disableDOMDelay = false;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch === false) throw new Error('proxy not found.');
        },*/
        pause: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = true;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error("proxy not found.");
        },
        resume: function (proxy) {
            let i = observables.length;
            let foundMatch = false;
            while (i--) {
                if (observables[i].parentProxy === proxy) {
                    observables[i].paused = false;
                    foundMatch = true;
                    break;
                }
            }
            //if (foundMatch === false) throw new Error("proxy not found.");
        }
    };
})();
export default ObservableSlim;
