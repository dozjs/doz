import index from"../../index.js";import wait from"../../../utils/wait.js";import animateHelper from"./animate-helper.js";const{directive:directive}=index;directive("animate",{onAppComponentCreate(e){Object.defineProperties(e,{animate:{value:animateHelper,enumerable:!0},elementsWithAnimation:{value:new Map,writable:!0}})},createLockRemoveInstanceByCallback(e){e.lockRemoveInstanceByCallback=(t,...i)=>{if(e.lockRemoveInstanceByCallbackIsCalled)return;e.lockRemoveInstanceByCallbackIsCalled=!0;let a=[];for(let[t,i]of e.elementsWithAnimation){let n=t,o=i;a.push(new Promise((t=>{if(!document.body.contains(n))return t();wait((e=>n._dozAttach.__animationUsedByShowDirective?(e(),!0):!n._dozAttach.__animationIsRunning),(()=>{let i={duration:o.hide.duration,delay:o.hide.delay,iterationCount:o.hide.iterationCount,cb:o.hide.cb,classLib:o.classLib};e.animate(n,o.hide.name,i,(()=>{n.style.display="none",t()}))}),1e3,(()=>{n._dozAttach.__animationReset()}))})))}Promise.all(a).then((()=>{e.lockRemoveInstanceByCallback=null,e.lockRemoveInstanceByCallbackIsCalled=!1,t.apply(e,i)}),(e=>{throw new Error(e)}))}},createAnimations(e,t,i){if(!t._dozAttach.__lockedForAnimation){if(t._dozAttach.__lockedForAnimation=!0,"string"==typeof i&&(i={show:i,hide:i}),t._dozAttach.__animationDirectiveValue=i,i.show){"object"!=typeof i.show&&(i.show={name:i.show});let a={duration:i.show.duration,delay:i.show.delay,iterationCount:i.show.iterationCount,cb:i.show.cb,classLib:i.classLib,mode:"show"};t._dozAttach.__animationShow=n=>e.animate(t,i.show.name,a,n),wait((e=>t._dozAttach.__animationUsedByShowDirective?(e(),!0):!t._dozAttach.__animationIsRunning),(()=>{document.body.contains(t)&&(t._dozAttach.__animationOriginDisplay&&(t.style.display=t._dozAttach.__animationOriginDisplay),"none"!==t.style.display&&e.animate(t,i.show.name,a))}),1e3,(()=>{t._dozAttach.__animationReset()}))}if(i.hide){"object"!=typeof i.hide&&(i.hide={name:i.hide});let a={duration:i.hide.duration,delay:i.hide.delay,iterationCount:i.hide.iterationCount,cb:i.hide.cb,classLib:i.classLib,mode:"hide"};t._dozAttach.__animationHide=n=>e.animate(t,i.hide.name,a,n),this.createLockRemoveInstanceByCallback(e)}e.elementsWithAnimation.set(t,i),setTimeout((()=>{Object.keys(e.children).forEach((t=>{const i=e.children[t],a=i.getHTMLElement(),n=e.elementsWithAnimation.get(a);n&&(i.lockRemoveInstanceByCallback||(i.elementsWithAnimation.set(a,n),this.createLockRemoveInstanceByCallback(i)))}))}))}},onComponentDOMElementCreate(e,t,i){this.createAnimations(e,t,i)},onAppComponentMount(e){if(e.elementsWithAnimation&&e.elementsWithAnimation.size)for(let[t,i]of e.elementsWithAnimation)this.createAnimations(e,t,i)}});